import { Component, OnInit } from '@angular/core';
import { DataStoreService } from '../../../services/data-store.service';
import { Subscription, take } from 'rxjs';
import { RideInfo } from '../../../models/data-store';
import { CacheService } from '../../../services/cache.service';
import { GeolocationService } from '../../../services/geolocation.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';

@Component({
  selector: 'app-check-requests',
  standalone: true,
  imports: [TableModule,ButtonModule],
  templateUrl: './check-requests.component.html',
  styleUrl: './check-requests.component.css'
})
export class CheckRequestsComponent implements OnInit {
  currInfos: RideInfo[] = []
  private geolocationSubscription?: Subscription
  loading = true
  hasOrder = false

  currentLocation?: GeolocationPosition;
  constructor(private readonly geoService: GeolocationService, private dataService: DataStoreService, private cache: CacheService, private router: Router) {}

  ngOnInit() {
    this.currInfos = this.cache.requestCache.getValue()
    this.currentLocation = this.geoService.curentLocation.getValue()
    this.loading = (this.currentLocation === undefined)

    const orderId = this.cache.userData.getValue()?.currOrderID
    this.hasOrder = (orderId !== -1 && orderId != null)

    this.geolocationSubscription = this.geoService.curentLocation.subscribe(pos => {
      this.currentLocation = pos
    })
    this.cache.userData.subscribe(userData => {
      if (!userData)
        return

      this.hasOrder = (userData.currOrderID != null && userData.currOrderID !== -1)
    })
    this.cache.requestCache.asObservable().subscribe(requests => {
      this.currInfos = requests
    })

    setInterval(() => {
      this.getDriveRequests()
    }, 5000)
  }
  ngOnDestroy() {
    if (this.geolocationSubscription) {
      this.geolocationSubscription.unsubscribe()
    }
  }

  getDriveRequests() {
    if (!this.currentLocation)
      return
    
    const currCoords = this.currentLocation.coords
    this.dataService.driverGetRequestRides(currCoords.latitude, currCoords.longitude).subscribe(availableInfos => {
      this.loading = false
      this.cache.requestCache.next(availableInfos)
    })
  }

  acceptDrive(driverId: string) {
    this.dataService.driverAcceptRide(driverId).subscribe(response => {
      if (response.success) {
        this.getDriveRequests()

        const userProf = this.dataService.getUserProfile()
        if (userProf && userProf.id) {
          this.dataService.userGetProfile(userProf.id).subscribe(response => {
            if (response.success) {
              this.dataService.storeUserProfile(response.body)
              this.router.navigate(['dashboard/myOrders']);
            } else {
              alert(response.message)
            }
          })
        }
      } else {
        alert(response.message)
      }
    })
  }
}

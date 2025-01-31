import { Component, ViewChild, AfterViewInit, OnInit, DestroyRef } from '@angular/core';
import { MapComponent } from "../../map/map.component";
import { Subscription, take } from 'rxjs';
import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataStoreService } from '../../../services/data-store.service';
import { GeolocationService } from '../../../services/geolocation.service';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { Router } from '@angular/router';
import { CacheService } from '../../../services/cache.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-ride-request',
  standalone: true,
  imports: [MapComponent, ReactiveFormsModule, CardModule, FloatLabelModule, InputTextModule, ButtonModule, ProgressSpinnerModule],
  templateUrl: './ride-request.component.html',
  styleUrl: './ride-request.component.css'
})
export class RideRequestComponent implements OnInit, AfterViewInit  {
  points: number[][] = [[41.749996, 45.7166638], [41.749996, 45.7166638]]
  formGroups: FormGroup[] = []
  @ViewChild(MapComponent) mapComponent!: MapComponent
  currentLocation?: GeolocationPosition
  private geolocationSubscription?: Subscription

  currentFare = 0.001
  routeTime = -1
  routeDistance = -1
  confirmLoading = false
  hasOrder = false

  constructor(private geoService: GeolocationService, private dataService: DataStoreService, private fb: FormBuilder, private router: Router, private cache: CacheService) {}

  ngOnDestroy() {
    if (this.geolocationSubscription) {
      this.geolocationSubscription.unsubscribe()
    }
  }
  ngOnInit() {
    const orderId = this.cache.userData.getValue()?.currOrderID
    this.hasOrder = (orderId !== -1 && orderId != null)
    this.cache.userData.subscribe(userData => {
      if (!userData)
        return

      this.hasOrder = (userData.currOrderID != null && userData.currOrderID !== -1)
    })

    this.geolocationSubscription = this.geoService.curentLocation.subscribe(pos => {
      this.currentLocation = pos
    })

    this.formGroups = this.points.map((point) =>
      new FormGroup({
        coords: new FormControl([point[0], point[1]], Validators.required)
      })
    )

    this.formGroups.forEach((formGroup, index) => {
      formGroup.valueChanges.subscribe((val) => {
        if (!val.coords) return

        const [lat, lng] = val.coords.split(',').map(Number)
        console.log(lat, lng)
        this.points[index] = [lat, lng]
        this.updateMarkers()
      })
    })
  }
  ngAfterViewInit() {
    if (this.mapComponent) {
      this.mapComponent.time.subscribe(val => this.routeTime = val)
      this.mapComponent.distance.subscribe(val => this.routeDistance = val)

      this.updateMarkers()
    }
  }

  onConfirm() {
    if (!this.currentLocation) return

    // TODO: Add some sort of animation as feedback
    this.confirmLoading = true
    const startPoint = this.points[0]
    const endPoint = this.points[1]
    this.dataService.userRequestRide(
      startPoint[0],
      startPoint[1],
      endPoint[0],
      endPoint[1],
      this.routeDistance,
      this.routeDistance * this.currentFare
    ).subscribe(response => {
      this.confirmLoading = false

      if (response.success)  {
        //this.router.navigate(['/dashboard/myOrders']);
      } else {
        alert(response.message)
      }
    })
  }

  updatePosition(val: number[]) {
    // TODO: Try to see if you can make this work with street names also
    this.formGroups[val[0]].setValue({coords: val[1] + ',' + val[2]})
  }
  setSelfPosition(index: number) {
    // TODO: Add small icon button next to field to set current position
    if (this.currentLocation == null)
        return
    this.updatePosition([index, this.currentLocation.coords.latitude, this.currentLocation.coords.longitude])
  }
  updateMarkers() {
    this.mapComponent.updateMarkers(this.points)
  }
}

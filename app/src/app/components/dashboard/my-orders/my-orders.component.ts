import { Component, OnInit } from '@angular/core';
import { Order } from '../../../models/data-store';
import { DataStoreService } from '../../../services/data-store.service';
import { MapComponent } from "../../map/map.component";
import { Subscription } from 'rxjs';
import { CacheService } from '../../../services/cache.service';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@Component({
  selector: 'app-my-orders',
  standalone: true,
  imports: [MapComponent, TableModule, CardModule, ButtonModule, DividerModule],
  templateUrl: './my-orders.component.html',
  styleUrl: './my-orders.component.css'
})
export class MyOrdersComponent implements OnInit {
  currentOrder?: Order
  ordersList: Order[] = []
  isDriver: boolean = false

  private userDataSub?: Subscription
  private userOrdersSub?: Subscription

  constructor(private dataService: DataStoreService, private cache: CacheService) {}
  ngOnInit(): void {
    this.dataService.userGetMyRides().subscribe(response => {
      if (response.success) {
        this.cache.userOrders.next(response.body)
      } else {
        alert(response.message)
      }
    })
    
    this.userOrdersSub = this.cache.userOrders.subscribe(orders => {
      this.ordersList = orders

      const userData = this.cache.userData.getValue()
      if (userData) {
        this.currentOrder = orders.find(order => {
          return order.id == userData?.currOrderID
        })
        if (this.currentOrder != null) {
          // userData.type == "driver" works usually, but for debugging I am allowing passanger to also accept rides
          // Also technically I guess this would be more valid check
          if (this.currentOrder.status == "initial") {
            this.isDriver = (this.currentOrder.driverID == userData.id) //(userData.type == "driver")
          } else {
            this.isDriver = false
            this.currentOrder = undefined
          }
        }
      } else {
        this.isDriver = false
        this.currentOrder = undefined
      }
    })
    this.userDataSub = this.cache.userData.subscribe(data => {
      if (!data) return

      if (this.currentOrder && this.currentOrder.id != data.currOrderID) {
        this.isDriver = false
        this.currentOrder = undefined
      }
      if (data.currOrderID !== -1) {
        this.currentOrder = this.ordersList.find(order => {
          return order.id == data.currOrderID
        })
      }
    })
  }
  ngOnDestroy() {
    if (this.userOrdersSub) {
      this.userOrdersSub.unsubscribe()
    }
    if (this.userDataSub) {
      this.userDataSub.unsubscribe()
    }
  }

  onOrderCompleted() {
    if (!this.isDriver)
      return

    this.dataService.driverCompleteRide().subscribe(response => {
      if (response.success) {
        this.cache.userOrders.next(response.body)
      } else {
        alert(response.success)
      }
    })
  }

  filteredOrdersList(): any[] {
    return this.ordersList.filter(order => order !== this.currentOrder);
  }
}

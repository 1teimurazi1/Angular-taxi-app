import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Order, RideInfo } from '../models/data-store';
import { User } from '../models/user';
import { DataStoreService } from './data-store.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class CacheService {
  isLoggedIn = new BehaviorSubject<boolean>(false)
  userData = new BehaviorSubject<User | null>(null)
  userOrders = new BehaviorSubject<Order[]>([])
  requestCache = new BehaviorSubject<RideInfo[]>([])
  adminDriversCache = new BehaviorSubject<User[]>([])
}

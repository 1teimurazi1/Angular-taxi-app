import { Injectable, OnDestroy } from '@angular/core';
import {CompatClient, Stomp, StompSubscription} from '@stomp/stompjs';
import { User } from '../models/user';
import { DataStoreService } from './data-store.service';
import { HttpHeaders } from '@angular/common/http';
import { CacheService } from './cache.service';
import { Order, RideInfo } from '../models/data-store';

@Injectable({
  providedIn: 'root'
})
export class WebsocketService implements OnDestroy {
  private connection: CompatClient | undefined = undefined
  private subscriptions: Map<string, StompSubscription> = new Map()

  constructor(private cache: CacheService, private db: DataStoreService) {
    cache.isLoggedIn.subscribe(val => {
      if (val) {
        this.connect()
      } else {
        this.disconnect()
      }
    })
  }

  connect() {
    if (this.connection) return;

    const client = Stomp.client(`ws://localhost:8080/ws?token=${this.getToken()}`)
    client.onConnect = (frame) => {
      console.log("Stomp Connected => " + frame)
      const currUser = this.cache.userData.getValue()
      if (currUser && currUser.id) {
        this.listenToProfile(currUser.id, (val) => {
          this.cache.userData.next(val)
        })
      } else {
        this.db.userLogoutRequest()
      }

      this.listenToOrders((val) => {
        console.log("RECIEVED ORDERS " + val)
        this.cache.userOrders.next(val)
      })
    }
    client.onDisconnect = (frame) => {
      console.log("Stomp Disconnect => " + frame)
    }
    client.onWebSocketError = (error) => {
      console.error("WebSocket Error:", error)
    }
    client.onStompError = (frame) => {
      console.error("STOMP Error:", frame)
    }
    client.activate()
    this.connection = client
  }
  disconnect() {
    if (!this.connection) return

    this.connection.deactivate()
    this.subscriptions.forEach((subscription, key) => {
      subscription.unsubscribe()
    })
    this.subscriptions.clear()
  }
  getToken() {
    return localStorage.getItem('authToken')
  }

  public listenToOrders(func: (reqs: Order[]) => void) {
    this.listen<Order[]>('orders', '/user/queue/orders', func)
  }
  public listenToProfile(userId: string, func: (val: User) => void) {
    this.listen<User>('profile', '/user/queue/profile', func)
  }

  private listen<T>(key: string, path: string, func: (val: T) => void): void {
    if (!this.connection) return

    if (this.subscriptions.has(key)) {
      console.warn(`Subscription with key '${key}' already exists.`)
      return
    }

    console.log(`Constructing specific websocket ${key}!`)
    const subscription = this.connection.subscribe(path, (msg) => {
      func(JSON.parse(msg.body) as T)
    })

    if (subscription) {
      this.subscriptions.set(key, subscription)
    }
  }
  public unsubscribe(key: string): void {
    const subscription = this.subscriptions.get(key)
    if (subscription) {
      subscription.unsubscribe()
      this.subscriptions.delete(key)
    } else {
      console.warn(`No subscription found with key '${key}'`)
    }
  }

  ngOnDestroy(): void {
    this.disconnect()
  }
}

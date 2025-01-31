import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from '../models/user';
import { BasicResponse, Order, RideInfo, UserLogin } from '../models/data-store';
import { BehaviorSubject } from 'rxjs';
import { JsonPipe } from '@angular/common';
import { CacheService } from './cache.service';
import { WebsocketService } from './websocket.service';

@Injectable({
  providedIn: 'root'
})
export class DataStoreService {
  private baseUrl = "http://localhost:8080";

  constructor(private http: HttpClient, private cache: CacheService) {
    cache.isLoggedIn.next(this.getToken() != null)
    cache.userData.next(this.getUserProfile())

    if (this.isTokenExpired()) {
      this.userLogoutRequest()
    }
  }

  userGetProfile(id: string) {
    const headers = this.getJWTHeader()
    const params = new HttpParams()
      .set('id', id)
    return this.http.get<BasicResponse<User>>(`${this.baseUrl}/api/getProfile`, {headers, params})
  }
  userLoginRequest(config: UserLogin) {
    var apiLink = `${this.baseUrl}/api/login`;
    return this.http.post<BasicResponse<User>>(apiLink, config)
  }
  userLogoutRequest() {
    this.deleteToken()
    this.storeUserProfile(null)
  }
  userRegisterRequest(config: User) {
    var apiLink = `${this.baseUrl}/api/register`;
    return this.http.post<BasicResponse<User>>(apiLink, config)
  }


  userGetMyRides() {
    const headers = this.getJWTHeader()
    return this.http.get<BasicResponse<Order[]>>(`${this.baseUrl}/api/getUserRides`, {headers})
  }
  userRequestRide(currLat: number, currLng: number, destLat: number, destLng: number, dist: number, price: number) {
    const headers = this.getJWTHeader()
    const input = {
      lat: currLat,
      lng: currLng,
      destinationLat: destLat,
      destinationLng: destLng,
      price: price,
      distance: dist,
    }
    return this.http.post<BasicResponse<string>>(`${this.baseUrl}/api/rideRequest`, input, {headers})
  }

  driverAcceptRide(orderId: string) {
    const headers = this.getJWTHeader()
    const params = new HttpParams()
      .set('orderId', orderId)
    return this.http.get<BasicResponse<Order>>(`${this.baseUrl}/api/acceptRide`, {headers, params})
  }
  driverGetRequestRides(currLat: number, currLng: number) {
    const headers = this.getJWTHeader()
    const params = new HttpParams()
      .set('lat', currLat)
      .set('lng', currLng);
    return this.http.get<RideInfo[]>(`${this.baseUrl}/api/getAvailableRides`, {headers, params})
  }
  driverCompleteRide() {
    const headers = this.getJWTHeader()
    return this.http.get<BasicResponse<Order[]>>(`${this.baseUrl}/api/completeRide`, {headers})
  }

  adminGetDrivers() {
    const headers = this.getJWTHeader()
    return this.http.get<BasicResponse<User[]>>(`${this.baseUrl}/admin/getDrivers`, {headers})
  }
  adminToggleDriver(id: string, val: boolean) {
    // I still pass in value so if desync happens, client is still asking for correct value to be set
    // For example if client thinks they are activating driver but on server they are already activated
    // If I just assume client means to do `not Activated` it would deactivate that driver which is wrong
    const headers = this.getJWTHeader()
    const params = new HttpParams().set('id', id).set('val', val)
    return this.http.get<BasicResponse<User[]>>(`${this.baseUrl}/admin/toggleDriver`, {headers, params})
  }


  /*
    getUserProfile() {
      const headers = this.getJWTHeader()
      return this.http.get<User>(`${this.baseUrl}/profile`, {headers})
    }
  */

  storeUserProfile(user: User | null) {
    if (user == null) {
      localStorage.removeItem('userData')
    } else {
      localStorage.setItem('userData', JSON.stringify(user))
    }
    this.cache.userData.next(user)
  }
  getUserProfile(): User | null {
    var userData = localStorage.getItem('userData')
    if (userData == null) return null;
    return JSON.parse(userData)
  }

  // JWT handlers
  isTokenExpired(): boolean {
    const token = this.getToken()
    if (token == null)
        return false
    
    try {
      const payloadBase64 = token.split('.')[1]
      const payload = JSON.parse(atob(payloadBase64))
      const currentTime = Math.floor(Date.now() / 1000)// Time in seconds
      return payload.exp < currentTime
    } catch(e) {// If somethign went wrong, probably wrong token
      console.error("Invalid JWT:", e)
      this.deleteToken()
      return true
    }
  }
  storeToken(token: string) {
    localStorage.setItem('authToken', token)
    this.cache.isLoggedIn.next(true)
  }
  deleteToken() {
    localStorage.removeItem('authToken')
    this.cache.isLoggedIn.next(false)
  }
  getToken() {
    return localStorage.getItem('authToken')
  }

  getJWTHeader() {
    const token = this.getToken()
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
    return headers
  }
}

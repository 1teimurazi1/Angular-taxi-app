import { Injectable } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GeolocationService as gService } from '@ng-web-apis/geolocation';

@Injectable({
  providedIn: 'root'
})
export class GeolocationService {
  curentLocation = new BehaviorSubject<GeolocationPosition | undefined>(undefined);

  constructor(private readonly geolocation$: gService) {
    const savedLocation = localStorage.getItem('currLocation')
    if (savedLocation) {
      this.curentLocation.next(JSON.parse(savedLocation))
    }

    geolocation$.subscribe(pos => {
      this.curentLocation.next(pos)
      localStorage.setItem('currLocation', JSON.stringify(pos))
    })
  }
}

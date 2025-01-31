import { AfterViewInit, Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import * as L from 'leaflet';
import 'leaflet-routing-machine';
import { BehaviorSubject, delay, every } from 'rxjs';

@Component({
  selector: 'app-map',
  standalone: true,
  imports: [],
  templateUrl: './map.component.html',
  styleUrl: './map.component.css'
})
export class MapComponent implements AfterViewInit, OnDestroy {
  private map?: L.Map
  private markers: L.Marker[] = []
  private routingControl: L.Routing.Control | null = null
  public mapId: string = 'map'
  private customIcon = L.icon({
    iconUrl: 'marker.png',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -32],
    tooltipAnchor: [16, 0],
  })

  @Output() time = new BehaviorSubject<number>(-1)
  @Output() distance = new BehaviorSubject<number>(-1)
  @Output() onPointChanged = new EventEmitter<number[]>()

  @Input() defaultMarkers: number[][] = []
  @Input() isStatic: boolean = false;

  constructor() {
    this.mapId = 'map-' + Math.random().toString(36).substring(2, 9)
  }
  ngAfterViewInit() {
    this.initMap()
    this.updateMarkers(this.defaultMarkers)
  }
  ngOnDestroy(): void {
    this.cleanUpMap()
  }

  // If you need help with customizing the map, here is API reference
  // https://leafletjs.com/reference.html
  private cleanUpMap() {
    if (this.routingControl) {
      this.routingControl.remove()
      this.routingControl = null
    }
    if (this.map) {
      this.map.off()
      this.map.remove()
      this.map = undefined
    }
  }
  private initMap() {
    if (this.map) {
      this.cleanUpMap()
    }

    this.map = L.map(this.mapId, {
      center: [41.749996, 45.7166638],// Kaxeti central
      minZoom: 9,
    })

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© MrOTAD'
    }).addTo(this.map);

    setTimeout(() => {
      this.map!.invalidateSize();
    }, 100);
  }

  updateRoute() {
    if (this.map == null) return;
    if (this.routingControl) {
      const waypoints = Array.from(this.markers.values()).map(marker => marker.getLatLng())
      this.routingControl.setWaypoints(waypoints)
    } else {
      if (this.markers.length < 2) return

      const waypoints = Array.from(this.markers.values()).map(marker => marker.getLatLng())
      const plan = L.Routing.plan(waypoints, {
        createMarker: (index, waypoint) => {
          const marker = L.marker(waypoint.latLng, { icon: this.customIcon, draggable: !this.isStatic })

          if (!this.isStatic) {
            marker.on('dragend', (event) => {
              const newLatLng = event.target.getLatLng()
              this.onPointChanged.emit([index, newLatLng.lat, newLatLng.lng])
              marker.setLatLng(newLatLng)
            })
          }


          return marker
        }
      })

      this.routingControl = L.Routing.control({
        routeWhileDragging: true,
        show: true,
        plan: plan,
        collapsible: true,
        lineOptions: {
          styles: [{ color: 'blue', weight: 4 }],
          extendToWaypoints: true,
          missingRouteTolerance: 1
        }
      })
      .on('routesfound', (event: any) => {
        const route = event.routes[0]
        const summary = route.summary
        this.time.next(summary.totalTime)
        this.distance.next(summary.totalDistance)
      })
      .addTo(this.map)
    }
  }

  updateMarkers(points: number[][]) {
    if (!this.map)
      return

    this.markers = points.map(val => L.marker([val[0], val[1]]))
    this.updateRoute()
  }
}

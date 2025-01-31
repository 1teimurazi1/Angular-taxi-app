import { Component } from '@angular/core';
import { DataStoreService } from '../../services/data-store.service';
import { Router, RouterOutlet } from '@angular/router';
import { MenubarModule } from 'primeng/menubar';
import { MenuItem, PrimeIcons } from 'primeng/api';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterOutlet, MenubarModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {
  nav_items: MenuItem[] = []
  constructor(private dataService: DataStoreService, private router: Router) {
    this.nav_items = [
      {
        label: "New Ride",
        icon: PrimeIcons.CAR,
        routerLink: ['/dashboard/rideRequest']
      },
      {
        label: "Ride Requests",
        icon: PrimeIcons.MAP_MARKER,
        routerLink: ['/dashboard/checkRequests']
      },
      {
        label: "My Orders",
        icon: PrimeIcons.WALLET,
        routerLink: ['/dashboard/myOrders']
      },
      {
        label: "Admin Page",
        icon: PrimeIcons.SITEMAP,
        routerLink: ['/dashboard/admin']
      }
    ]
  }
}

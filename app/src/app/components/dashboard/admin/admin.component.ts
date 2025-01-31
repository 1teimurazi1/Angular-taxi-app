import { Component, OnInit } from '@angular/core';
import { User } from '../../../models/user';
import { DataStoreService } from '../../../services/data-store.service';
import { CacheService } from '../../../services/cache.service';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [TableModule, ButtonModule, TagModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  drivers: User[] = []
  constructor(private dataService: DataStoreService, private cache: CacheService) {}

  ngOnInit(): void {
    this.cache.adminDriversCache.subscribe(drivers => {
      this.drivers = drivers.sort((a, b) => {
        if (a.status == null && b.status != null) return -1
        if (a.status != null && b.status == null) return 1
        return (a.id || "").localeCompare(b.id || "")
      })
    })
    this.dataService.adminGetDrivers().subscribe(response => {
      if (response.success) {
        this.cache.adminDriversCache.next(response.body)
      } else {
        alert(response.message)
      }
    })
  }

  toggleDriver(driver: User) {
    if (!driver.id) return
    this.dataService.adminToggleDriver(driver.id, driver.status != "active").subscribe(response => {
      if (response.success) {
        this.cache.adminDriversCache.next(response.body)
      } else {
        alert(response.message)
      }
    })
  }
}

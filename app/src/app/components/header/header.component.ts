import { Component } from '@angular/core';
import { DataStoreService } from '../../services/data-store.service';
import { User } from '../../models/user';
import { CacheService } from '../../services/cache.service';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, ButtonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  userProfile: User | null = null
  isLoggedIn: boolean = false
  jwtToken: String = "<N/A>"

 constructor(private dataService: DataStoreService, private cache: CacheService) {
  this.jwtToken = dataService.getToken() || "<N/A>"
  this.userProfile = cache.userData.getValue()
  this.isLoggedIn = cache.isLoggedIn.getValue()

  cache.userData.asObservable().subscribe(user => {
    this.userProfile = user
  })
  cache.isLoggedIn.asObservable().subscribe(loggedIn => {
    this.isLoggedIn = loggedIn
    this.jwtToken = dataService.getToken() || "<N/A>"
  })

  this.refreshProfileData()
 }

 refreshProfileData() {
  if (!this.userProfile || !this.userProfile.id) return
  this.dataService.userGetProfile(this.userProfile.id).subscribe(response => {
    if (response.success) {
      this.dataService.storeUserProfile(response.body)
    } else {
      alert(response.message)
    }
  })
 }

 logout() {
  this.dataService.userLogoutRequest()
 }
}

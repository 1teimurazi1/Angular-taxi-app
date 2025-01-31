import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataStoreService } from '../../services/data-store.service';
import { UserLogin } from '../../models/data-store';
import { Router } from '@angular/router';
import { CardModule } from 'primeng/card';
import { FloatLabelModule } from 'primeng/floatlabel';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ReactiveFormsModule, CardModule, FloatLabelModule, InputTextModule, ButtonModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  form = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private dataService: DataStoreService, private router: Router) {}

  onSubmit() {
    if (!this.form.valid) return;

    console.log(this.form.value as UserLogin);
    this.dataService.userLoginRequest(this.form.value as UserLogin).subscribe((response) => {
      if (response.success) {
        this.dataService.storeUserProfile(response.body)
        this.dataService.storeToken(response.message)
        this.router.navigate(['dashboard']);
      } else {
        alert(response.body)
      }
    })
  }
}

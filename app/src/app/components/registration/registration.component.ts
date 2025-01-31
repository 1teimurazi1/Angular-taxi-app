import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataStoreService } from '../../services/data-store.service';
import { User } from '../../models/user';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FloatLabelModule } from 'primeng/floatlabel';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { CascadeSelectModule } from 'primeng/cascadeselect';

@Component({
  selector: 'app-registration',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink, FloatLabelModule, ButtonModule, CardModule, InputMaskModule, InputTextModule, PasswordModule, CascadeSelectModule],
  templateUrl: './registration.component.html',
  styleUrl: './registration.component.css'
})
export class RegistrationComponent implements OnInit {
  carModels: any[] = [
    {
      "name": "Truck",
      "code": "TRK",
      "brands": [
        {
          "name": "Ford",
          "models": [
            {
              "cname": "F-150",
              "code": "F150"
            },
            {
              "cname": "Ranger",
              "code": "RNG"
            }
          ]
        },
        {
          "name": "Chevrolet",
          "models": [
            {
              "cname": "Silverado",
              "code": "SLV"
            },
            {
              "cname": "Colorado",
              "code": "COL"
            }
          ]
        }
      ]
    },
    {
      "name": "Minivan",
      "code": "MNV",
      "brands": [
        {
          "name": "Toyota",
          "models": [
            {
              "cname": "Sienna",
              "code": "SNA"
            }
          ]
        },
        {
          "name": "Honda",
          "models": [
            {
              "cname": "Odyssey",
              "code": "ODY"
            }
          ]
        }
      ]
    }
  ]
  type: string = 'passenger'
  controls: string[] = []
  form = new FormGroup({
    firstName: new FormControl('', Validators.required),
    lastName: new FormControl('', Validators.required),
    phoneNumber: new FormControl('', [Validators.required, Validators.minLength(12)]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', Validators.required),
    confirmPassword: new FormControl('', Validators.required),

    carModel: new FormControl(''),
    plateNumber: new FormControl('')
  })

  constructor(private dataService: DataStoreService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.controls = Object.keys(this.form.controls)
    this.route.paramMap.subscribe((params) => {
      this.type = params.get('type') || 'passenger'
      if (this.type == 'driver') {
        this.form.get('carModel')?.setValidators(Validators.required)
        this.form.get('plateNumber')?.setValidators([Validators.required, Validators.minLength(7)])
      } else {
        this.form.get('carModel')?.clearValidators()
        this.form.get('plateNumber')?.clearValidators()
      }
    })
  }

  onSubmit() {
    if (!this.form.valid || this.type == null) return;

    // What else can I do? Please forgive me for my sins
    const val: any = this.form.value
    if (val.carModel) val.carModel = val.carModel.cname
    val.confirmPassword = null

    var user = {...val as User}
    user.type = this.type
    console.log(user)
    this.dataService.userRegisterRequest(user).subscribe((response) => {
      console.log(response)
      if (response.success) {
        this.router.navigate(['login']);
      } else {
        alert(response.message)
      }
    })
  }
}

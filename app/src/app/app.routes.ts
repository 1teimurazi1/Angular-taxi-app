import { Routes } from '@angular/router';
import { HomepageComponent } from './components/homepage/homepage.component';
import { RegistrationComponent } from './components/registration/registration.component';
import { LoginComponent } from './components/login/login.component';
import { AuthGuard } from './guards/auth.guard';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { NoAuthGuard } from './guards/no.auth.guard';
import { RideRequestComponent } from './components/dashboard/ride-request/ride-request.component';
import { CheckRequestsComponent } from './components/dashboard/check-requests/check-requests.component';
import { MyOrdersComponent } from './components/dashboard/my-orders/my-orders.component';
import { AdminComponent } from './components/dashboard/admin/admin.component';

export const routes: Routes = [
    {
        path: '',
        component: HomepageComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'dashboard',
        component: DashboardComponent,
        canActivate: [NoAuthGuard],
        children: [
            {
                path: 'rideRequest',
                component: RideRequestComponent
            },
            {
                path: 'checkRequests',
                component: CheckRequestsComponent
            },
            {
                path: 'myOrders',
                component: MyOrdersComponent
            },
            {
                path: 'admin',
                component: AdminComponent
            }
        ]
    },
    {
        path: 'register/:type',
        component: RegistrationComponent,
        canActivate: [AuthGuard]
    },
    {
        path: 'login',
        component: LoginComponent,
        canActivate: [AuthGuard]
    }
];

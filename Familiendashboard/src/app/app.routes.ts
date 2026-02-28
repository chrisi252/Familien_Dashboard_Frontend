import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { WidgetComponent } from './components/widget-component/widget-component';
import { DashboardComponent } from './components/dashboard-component/dashboard-component';


export const routes: Routes = [
    {
        path:'login',
        component:LoginComponent,

    },
    {
        path:'dashboard',
        component:DashboardComponent,
    },
    {
        path:'widgets',
        component:WidgetComponent,
    },
    {
        path:'**',
        component:LoginComponent,

    }
];

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { WidgetComponent } from './components/widget-component/widget-component';


export const routes: Routes = [
    {
        path:'login',
        component:LoginComponent,

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

import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';


export const routes: Routes = [
    {
        path:'**',
        component:LoginComponent,

    }
];

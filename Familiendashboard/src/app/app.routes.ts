import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { WidgetComponent } from './components/widget-component/widget-component';
import { DashboardComponent } from './components/dashboard-component/dashboard-component';
import { RegisterComponent } from './components/register-component/register-component';
import { FamilyadminComponent } from './components/admin-component/familyadmin-component';
import { EditUsers } from './components/admin-component/edit-users/edit-users';
import { EditDashboard } from './components/admin-component/edit-dashboard/edit-dashboard';
import { EditWidgets } from './components/admin-component/edit-widgets/edit-widgets';


export const routes: Routes = [
    {
        path:'login',
        component:LoginComponent,

    },
    {
        path:'familyadmin',
        component:FamilyadminComponent,

        children: [
      { 
        path: 'editusers', 
        component: EditUsers 
      },
      {
        path: 'editdashboard',
        component: EditDashboard
      },
      {
        path:'editwidgets',
        component:EditWidgets
      },
      {
        path: 'dashboard',
        component: DashboardComponent
      }
    ]
    },

  
    
    {
        path:'register',
        component:RegisterComponent,

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

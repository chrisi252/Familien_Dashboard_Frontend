import { Routes } from '@angular/router';
import { LoginComponent } from './components/login-component/login-component';
import { WidgetComponent } from './components/widget-component/widget-component';
import { DashboardComponent } from './components/dashboard-component/dashboard-component';
import { RegisterComponent } from './components/register-component/register-component';
import { FamilySelectionComponent } from './components/family-selection-component/family-selection-component';
import { JoinFamily } from './components/family-selection-component/join-family/join-family';
import { CreateFamily } from './components/family-selection-component/create-family/create-family';
import { FamilyadminComponent } from './components/admin-component/familyadmin-component';
import { EditUsers } from './components/admin-component/edit-users/edit-users';
import { EditDashboard } from './components/admin-component/edit-dashboard/edit-dashboard';
import { EditWidgets } from './components/admin-component/edit-widgets/edit-widgets';
import { ProfileComponent } from './components/profile-component/profile-component';



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
      path: 'family-selection',
      component: FamilySelectionComponent,
      children: [
        { path: 'join', component: JoinFamily },
        { path: 'join/:familyId', component: JoinFamily },
        { path: 'create', component: CreateFamily }
      ]
    },
    {
        path:'dashboard',
        component:DashboardComponent,
    },
    {
      path:'profile',
      component:ProfileComponent,
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

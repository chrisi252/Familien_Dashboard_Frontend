import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./components/login-component/login-component').then(m => m.LoginComponent),
    },
    {
        path: 'familyadmin',
        loadComponent: () => import('./components/admin-component/familyadmin-component').then(m => m.FamilyadminComponent),
        canActivate: [authGuard],
        children: [
            {
                path: 'editusers',
                loadComponent: () => import('./components/admin-component/edit-users/edit-users').then(m => m.EditUsers)
            },
            {
                path: 'editdashboard',
                loadComponent: () => import('./components/admin-component/edit-dashboard/edit-dashboard').then(m => m.EditDashboard)
            },
            {
                path: 'editwidgets',
                loadComponent: () => import('./components/admin-component/edit-widgets/edit-widgets').then(m => m.EditWidgets)
            },
            {
                path: 'dashboard',
                loadComponent: () => import('./components/dashboard-component/dashboard-component').then(m => m.DashboardComponent)
            }
        ]
    },
    {
        path: 'register',
        loadComponent: () => import('./components/register-component/register-component').then(m => m.RegisterComponent),
    },
    {
        path: 'family-selection',
        loadComponent: () => import('./components/family-selection-component/family-selection-component').then(m => m.FamilySelectionComponent),
        canActivate: [authGuard],
        children: [
            {
                path: 'join',
                loadComponent: () => import('./components/family-selection-component/join-family/join-family').then(m => m.JoinFamily)
            },
            {
                path: 'join/:familyId',
                loadComponent: () => import('./components/family-selection-component/join-family/join-family').then(m => m.JoinFamily)
            },
            {
                path: 'create',
                loadComponent: () => import('./components/family-selection-component/create-family/create-family').then(m => m.CreateFamily)
            }
        ]
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./components/dashboard-component/dashboard-component').then(m => m.DashboardComponent),
        canActivate: [authGuard]
    },
    {
        path: 'profile',
        loadComponent: () => import('./components/profile-component/profile-component').then(m => m.ProfileComponent),
        canActivate: [authGuard]
    },
    {
        path: 'widgets',
        loadComponent: () => import('./components/widget-component/widget-component').then(m => m.WidgetComponent),
    },
    {
        path: '**',
        loadComponent: () => import('./components/login-component/login-component').then(m => m.LoginComponent),
    }
];

import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome';
import { SecretComponent } from './secret';
import { CardDeckComponent } from './card-deck';
import { AuthGuard } from '../lib/guard';


const appRoutes: Routes = [
  {
    path: '',
    redirectTo: '/welcome',
    pathMatch: 'full'
  },
  {
    path: 'welcome',
    component: WelcomeComponent
  },
  {
    path: 'card-deck',
    component: CardDeckComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'secret',
    component: SecretComponent,
    canActivate: [AuthGuard]
  }
];


// export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);
export const routing: ModuleWithProviders = RouterModule.forRoot(appRoutes);

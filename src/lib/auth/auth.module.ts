import { NgModule } from '@angular/core';
import { AUTH_PROVIDERS } from 'angular2-jwt';

import { AuthService } from './auth.service';
import { FirebaseAuthService } from './firebase-auth.service';
import { AuthGuard } from './auth.guard';


@NgModule({
  providers: [
    AuthService,
    AuthGuard,
    FirebaseAuthService,
    AUTH_PROVIDERS,
  ],
})
export class AuthModule { }

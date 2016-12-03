import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs/Rx';
import { tokenNotExpired } from 'angular2-jwt';
import Auth0Lock from 'auth0-lock';

import { AuthUser } from '../types';
import {
  Store, Dispatcher, Action,
  InitializeAction, UpdateAuthIdTokenAction, UpdateAuthUserProfileAction, AuthLogoutAction
} from '../store';

import { FirebaseAuthService } from './firebase-auth.service';
import { auth0Config as config } from './auth.config';
// import { AUTH_ID_TOKEN, AUTH_PROFILE, WELCOME_PAGE, AppKind } from '../const';


const auth0ClientId = config.auth0ClientId;
const auth0Domain = config.auth0Domain;
const auth0Options = {
  auth: {
    redirect: false
  },
  autoclose: true,
  // redirectUrl: location.protocol + location.host,
};


@Injectable()
export class AuthService {
  private lock: Auth0LockStatic;
  // readonly auth0User$ = new ReplaySubject<AuthUser | null>();
  private login$ = new Subject<void>();


  constructor(
    private router: Router,
    private dispatcher$: Dispatcher<Action>,
    private store: Store,
    private firebaseAuthService: FirebaseAuthService,
  ) {
    (async () => {
      this.dispatcher$.next(new InitializeAction());
      await this.updateAuthenticatedState();

      this.lock = new Auth0Lock(auth0ClientId, auth0Domain, auth0Options);

      this.lock.on('authenticated', async (authResult) => {
        this.dispatcher$.next(new UpdateAuthIdTokenAction(authResult.idToken));
        console.log('authResult:', authResult);
        // await this.updateAuthenticatedState();

        this.lock.getProfile(authResult.idToken, async (err, profile) => {
          if (err) { throw err; }
          this.dispatcher$.next(new UpdateAuthUserProfileAction(profile));
          console.log('profile:', profile);
          this.login$.next();
          await this.updateAuthenticatedState();
        });
      });
    })();
  }


  login(): Observable<void> {
    this.lock.show();
    return this.login$.asObservable();
  }


  logout(): Observable<void> {
    this.dispatcher$.next(new AuthLogoutAction());
    return Observable.from(this.firebaseAuthService.logout());
  }


  private async updateAuthenticatedState(): Promise<void> {
    if (this.authenticated()) {
      console.log('Auth0: LOG-IN');
      const state = await this.store.getState().take(1).toPromise();
      if (state.authIdToken && state.authUser) {
        await this.firebaseAuthService.login(state.authIdToken, state.authUser.user_id);
      }
    } else {
      console.log('Auth0: LOG-OUT');
      this.logout();
    }
  }


  authenticated() {
    // Check if there's an unexpired JWT
    // This searches for an item in localStorage with key == 'id_token'
    return tokenNotExpired();
  };

}

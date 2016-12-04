import { Injectable } from '@angular/core';
import { Http } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import * as firebase from 'firebase';

import { Store, Dispatcher, Action, FirebaseAuthLogoutAction, UpdateFirebaseUserProfileAction } from '../store';
import { FirebaseUser } from '../types';
import { firebaseConfig, azureFunctionsConfig as functionConfig } from '../../config';
import { FunctionService } from '../functions';

const endpointCreateCustomToken = functionConfig.api + functionConfig.function + 'createCustomToken';


@Injectable()
export class FirebaseAuthService {
  // firebaseApp: firebase.app.App;


  constructor(
    private http: Http,
    private dispatcher$: Dispatcher<Action>,
    private store: Store,
    private func: FunctionService,
  ) {
    firebase.initializeApp(firebaseConfig);
    this.stanby();
  }


  stanby(): void {
    firebase.auth().onAuthStateChanged((user: FirebaseUser) => {
      if (user) {
        console.log('Firebase Auth: SIGN-IN');
        this.dispatcher$.next(new UpdateFirebaseUserProfileAction(user));
        this.store.getState().take(1).subscribe(async (state) => {
          if (state.authUser) {
            await this.writeUserProfile(state.authUser, user);
            console.log('writeUserProfile is successed.');
          }
        });
      } else {
        console.log('Firebase Auth: SIGN-OUT');
        this.dispatcher$.next(new UpdateFirebaseUserProfileAction(null));
      }
    });
  }


  async signIn(auth0IdToken: string, user_id: string): Promise<void> {
    console.log('FirebaseAuth signIn method')
    try {
      const headers = await this.func.createHeaders();
      const result = await this.http.post(endpointCreateCustomToken, { user_id }, { headers })
        .timeoutWith(1000 * 30, Observable.throw('createCustomToken request is timeout.'))
        .map(res => res.json() as { customToken: string })
        .toPromise();
      console.log('createCustomToken result:', result);
      await firebase.auth().signInWithCustomToken(result.customToken);
    } catch (err) {
      throw new Error(err);
    }
  }


  async signOut(): Promise<void> {
    try {
      await firebase.auth().signOut();
      this.dispatcher$.next(new FirebaseAuthLogoutAction());
    } catch (err) {
      throw new Error(err);
    }
  }


  async writeUserProfile(auth0UserProfile: Auth0UserProfile, firebaseUser: firebase.User): Promise<void> {
    try {
      const user = firebase.auth().currentUser;
      if (user) {
        const p1 = firebase.database().ref('profile/' + user.uid + '/auth0').set(auth0UserProfile) as Promise<any>;

        const parsedFirebaseUser = JSON.parse(JSON.stringify(firebaseUser));
        const p2 = firebase.database().ref('profile/' + user.uid + '/firebase').set(parsedFirebaseUser) as Promise<any>;

        await Promise.all([p1, p2]);
      }
    } catch (err) {
      throw new Error(err);
    }
  }

}

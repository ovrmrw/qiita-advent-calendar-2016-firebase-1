import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import { Observable, ReplaySubject } from 'rxjs/Rx';
import * as firebase from 'firebase';

import { Store, Dispatcher, Action, FirebaseAuthLogoutAction, UpdateFirebaseUserProfileAction } from '../store';
import { FirebaseUser } from '../types';
import { fireauthConfig, createCustomTokenFunctionConfig as functionConfig } from './firebase-auth.config';

const ENDPOINT = functionConfig.api + functionConfig.function;
const FUNCTION_KEY = functionConfig.code;


firebase.initializeApp(fireauthConfig);


@Injectable()
export class FirebaseAuthService {
  readonly firebaseCurrentUser$ = new ReplaySubject<FirebaseUser | null>();


  constructor(
    private http: Http,
    private dispatcher$: Dispatcher<Action>,
    private store: Store,
  ) {
    this.stanby();
  }


  async login(auth0IdToken: string, user_id: string): Promise<void> {
    try {
      const headers = new Headers({
        'Authorization': 'Bearer ' + auth0IdToken,
        'x-functions-key': FUNCTION_KEY,
      });

      const result = await this.http.post(ENDPOINT, { user_id }, { headers })
        .timeoutWith(1000 * 60, Observable.throw('createCustomToken request is timeout.'))
        .map(res => res.json().result as { customToken: string })
        .toPromise();
      console.log('createCustomToken result:', result);
      await firebase.auth().signInWithCustomToken(result.customToken);
    } catch (err) {
      throw new Error(err);
    }
  }


  async logout(): Promise<void> {
    try {
      await firebase.auth().signOut();
      this.dispatcher$.next(new FirebaseAuthLogoutAction());
    } catch (err) {
      throw new Error(err);
    }
  }


  stanby(): void {
    firebase.auth().onAuthStateChanged((user: FirebaseUser) => {
      if (user) {
        console.log('Firebase Auth: LOG-IN');
        this.dispatcher$.next(new UpdateFirebaseUserProfileAction(user));
        this.store.getState().take(1).subscribe(async (state) => {
          if (state.authUser) {
            await this.writeUserProfile(state.authUser, user);
            console.log('writeUserProfile is successed.');
          }
        });
      } else {
        console.log('Firebase Auth: LOG-OUT');
        this.dispatcher$.next(new UpdateFirebaseUserProfileAction(null));
      }
    });
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

import { Injectable, Inject, Optional } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, Subject } from 'rxjs/Rx';

import { FirebaseEffector } from './firebase-effector';
import { Dispatcher, Provider, ReducerContainer } from './common';
import { AppState } from './store.types';
import {
  Action, RestoreAction
} from './actions';
import {
  authIdTokenStateReducer, authUserStateReducer, firebaseUserStateReducer,
  graphUserStateReducer, cardsStateReducer, draftCardStateReducer,
  restoreStateMapper, afterRestoredStateReducer,
} from './reducers';


const initialState: AppState = {
  authIdToken: null,
  authUser: null,
  firebaseUser: null,
  graphUsers: [],
  isAuthed: false,
  cards: [],
  draftCard: null,
  uid: '',
  restore: false,
  afterRestored: false,
};


@Injectable()
export class Store {
  private provider$: Provider<AppState>;
  private firebaseEffectorTrigger$ = new Subject<AppState>();
  private firebaseRestoreFinished$ = new Subject<boolean>();


  constructor(
    private dispatcher$: Dispatcher<Action>,
    @Inject(FirebaseEffector) @Optional()
    private firebaseEffector: FirebaseEffector | null,
  ) {
    this.provider$ = new BehaviorSubject<AppState>(initialState);
    this.combineReducers();
    this.applyEffectors();
  }


  private combineReducers(): void {
    ReducerContainer
      .zip<AppState>(...[
        authIdTokenStateReducer(initialState.authIdToken, this.dispatcher$),
        authUserStateReducer(initialState.authUser, this.dispatcher$),
        firebaseUserStateReducer(initialState.firebaseUser, this.dispatcher$),
        graphUserStateReducer(initialState.graphUsers, this.dispatcher$),
        cardsStateReducer(initialState.cards, this.dispatcher$),
        draftCardStateReducer(initialState.draftCard, this.dispatcher$),
        restoreStateMapper(this.dispatcher$),
        afterRestoredStateReducer(initialState.afterRestored, this.dispatcher$),

        (authIdToken, authUser, firebaseUser, graphUsers, cards, draftCard, restore, afterRestored): AppState => {
          const obj = { authIdToken, authUser, firebaseUser, graphUsers, cards, draftCard, restore, afterRestored };
          const isAuthed = !!authIdToken && !!authUser && !!firebaseUser;
          const uid: string = authUser && firebaseUser && authUser.user_id === firebaseUser.uid ? firebaseUser.uid : '';
          console.log('uid:', uid);
          return Object.assign<{}, AppState, {}, {}>({}, initialState, obj, { isAuthed, uid });
        }
      ])
      .subscribe(newState => {
        console.log('newState:', newState);
        this.provider$.next(newState);
        this.firebaseEffectorTrigger$.next(newState);
      });
  }


  private applyEffectors(): void {
    if (this.firebaseEffector) {
      /* Firebase Inbound */
      this.firebaseEffectorTrigger$
        .distinctUntilChanged((oldState, newState) => oldState.uid === newState.uid)
        .filter(state => !!state.uid)
        .do(() => this.firebaseRestoreFinished$.next(false))
        .subscribe(state => {
          if (this.firebaseEffector) {
            this.firebaseEffector.connect$<AppState>('store/' + state.uid)
              .take(1)
              .subscribe(cloudState => {
                console.log('============================= firebase inbound')
                console.log('state:', cloudState)
                if (cloudState) {
                  this.dispatcher$.next(new RestoreAction(cloudState));
                } else {
                  alert('Initial user setup is done.');
                }
              }, (err) => { }, () => {
                this.firebaseRestoreFinished$.next(true);
              });
          }
        });

      /* Firebase Outbound */
      this.firebaseEffectorTrigger$
        .combineLatest(this.firebaseRestoreFinished$)
        .filter(values => values[1] && !!values[0].uid && !values[0].restore) /* RestoreActionではない場合のみFirebaseに書き込みする。 */
        .map(values => values[0])
        .debounceTime(200)
        .subscribe(state => {
          console.log('============================= firebase outbound')
          console.log('state:', state);
          if (this.firebaseEffector) {
            this.firebaseEffector.saveCurrentState('store/' + state.uid, state);
          }
        });
    }
  }


  getState(): Observable<AppState> {
    return this.provider$;
  }

}

import { Injectable, Inject, Optional, NgZone } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject, Subject } from 'rxjs/Rx';
import * as uuid from 'uuid';

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
  userId: '',
  restore: false,
  afterRestored: false,
  uuid: uuid.v4(), // 起動毎にクライアントを識別するためのユニークなIDを生成する。
};


@Injectable()
export class Store {
  private provider$: Provider<AppState>;
  private dispatcherQueue$: Dispatcher<Action>;
  private firebaseEffectorTrigger$ = new Subject<AppState>();
  private firebaseRestoreFinished$ = new Subject<boolean>();


  constructor(
    private zone: NgZone,
    private dispatcher$: Dispatcher<Action>,
    @Inject(FirebaseEffector) @Optional()
    private firebaseEffector: FirebaseEffector | null,
  ) {
    this.dispatcherQueue$ = // DispatcherではなくDispatcherQueueをReducerに代入する。
      this.dispatcher$
        .concat() // Actionを発行順に処理する。
        .timeoutWith(1000 * 20, Observable.throw('Async action is too much long.')) as Dispatcher<Action>; // 指定時間を超える非同期処理は例外スローさせる。

    this.provider$ = new BehaviorSubject<AppState>(initialState);
    this.combineReducers();
    this.applyEffectors();
  }


  private combineReducers(): void {
    ReducerContainer
      .zip<AppState>(...[
        authIdTokenStateReducer(initialState.authIdToken, this.dispatcherQueue$),
        authUserStateReducer(initialState.authUser, this.dispatcherQueue$),
        firebaseUserStateReducer(initialState.firebaseUser, this.dispatcherQueue$),
        graphUserStateReducer(initialState.graphUsers, this.dispatcherQueue$),
        cardsStateReducer(initialState.cards, this.dispatcherQueue$),
        draftCardStateReducer(initialState.draftCard, this.dispatcherQueue$),
        restoreStateMapper(this.dispatcherQueue$),
        afterRestoredStateReducer(initialState.afterRestored, this.dispatcherQueue$),

        (authIdToken, authUser, firebaseUser, graphUsers, cards, draftCard, restore, afterRestored): AppState => {
          const obj = { authIdToken, authUser, firebaseUser, graphUsers, cards, draftCard, restore, afterRestored };
          const isAuthed: boolean = !!authIdToken && !!authUser && !!firebaseUser;
          const userId: string = authUser && firebaseUser && authUser.user_id === firebaseUser.uid ? firebaseUser.uid : '';
          console.log('uid:', userId);
          return Object.assign<{}, AppState, {}, {}>({}, initialState, obj, { isAuthed, userId });
        }
      ])
      .subscribe(newState => {
        console.log('newState:', newState);
        this.zone.run(() => { // Zoneが捕捉できるようにするためにzone.runでラップしている。
          this.provider$.next(newState);
        });
        this.effectAfterReduced(newState);
      });
  }


  private effectAfterReduced(state: AppState): void {
    this.firebaseEffectorTrigger$.next(state);
  }


  private applyEffectors(): void {
    if (this.firebaseEffector) {
      /* Firebase Inbound (Firebaseからデータを取得する) */
      this.firebaseEffectorTrigger$
        // .filter(() => false) // 一時的にInboundを止める。
        .distinctUntilChanged((oldState, newState) => oldState.userId === newState.userId)
        .do(() => this.firebaseRestoreFinished$.next(false))
        .filter(state => !!state.userId)
        .subscribe(state => {
          if (this.firebaseEffector) {
            this.firebaseEffector.connect$<AppState>('store/' + state.userId)
              .map(cloudState => cloudState ? cloudState : initialState) // クラウドからデータを取得できない場合はinitialStateに置き換える。
              .filter(cloudState => initialState.uuid !== cloudState.uuid) // 自分以外のクライアントがクラウドデータを変更した場合だけ自分に反映させる。
              .subscribe(cloudState => {
                console.log('============================= Firebase Inbound (uuid:' + cloudState.uuid + ')');
                // if (cloudState) {
                this.dispatcher$.next(new RestoreAction(cloudState));
                // } else {
                //   alert('Initial user setup is done.');
                // }
                this.firebaseRestoreFinished$.next(true);
              });
          }
        });

      /* Firebase Outbound (データ更新毎にFirebaseへ保存する) */
      this.firebaseEffectorTrigger$
        // .filter(() => false) // 一時的にOutboundを止める。
        .combineLatest(this.firebaseRestoreFinished$, (state, afterRestored) => {
          return { state, afterRestored };
        })
        .filter(obj => obj.afterRestored) // RestoreAction発行済みの場合は通過する。
        .filter(obj => !!obj.state.userId && !obj.state.restore) // RestoreActionではない場合のみ通過する。
        .map(obj => obj.state)
        .debounceTime(200)
        .subscribe(state => {
          console.log('============================= Firebase Outbound (uuid:' + state.uuid + ')');
          if (this.firebaseEffector) {
            this.firebaseEffector.saveCurrentState('store/' + state.userId, state);
          }
        });
    }
  }


  getState(): Observable<AppState> {
    return this.provider$;
  }

}

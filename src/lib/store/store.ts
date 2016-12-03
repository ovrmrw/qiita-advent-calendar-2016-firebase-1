import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, ReplaySubject } from 'rxjs/Rx';

import { Dispatcher, Provider, ReducerContainer } from './common';
import { Action } from './actions';
import { AppState } from './types';
import {
  authIdTokenStateReducer, authUserStateReducer, firebaseUserStateReducer,
  graphUserStateReducer, cardsStateReducer, draftCardStateReducer,
} from './reducers';


const initialState: AppState = {
  authIdToken: null,
  authUser: null,
  firebaseUser: null,
  graphUsers: [],
  isAuthed: false,
  cards: [],
  draftCard: null,
};


@Injectable()
export class Store {
  private provider$: Provider<AppState>;


  constructor(
    private dispatcher$: Dispatcher<Action>
  ) {
    this.provider$ = new ReplaySubject<AppState>();
    this.combineReducers();
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

        (authIdToken, authUser, firebaseUser, graphUsers, cards, draftCard): AppState => {
          const obj = { authIdToken, authUser, firebaseUser, graphUsers, cards, draftCard };
          const isAuthed = !!authIdToken && !!authUser && !!firebaseUser;
          return Object.assign<{}, AppState, {}, {}>({}, initialState, obj, { isAuthed });
        }
      ])
      .subscribe(newState => {
        console.log('newState:', newState);
        this.provider$.next(newState);
      });
  }


  getState(): Observable<AppState> {
    return this.provider$;
  }

}

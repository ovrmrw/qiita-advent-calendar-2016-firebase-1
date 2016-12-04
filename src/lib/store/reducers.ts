import { Dispatcher, StateReducer, NonStateReducer } from './common';
import { User } from './store.types';
import { AuthUser, FirebaseUser } from '../types';
import { Card } from '../../app/app.types';
// import { AUTH_ID_TOKEN, AUTH_PROFILE } from '../const';
import {
  Action,
  InitializeAction,
  UpdateAuthIdTokenAction, UpdateAuthUserProfileAction, UpdateFirebaseUserProfileAction,
  RequestGraphUsersAction, ClearGraphUsersAction,
  AuthLogoutAction, FirebaseAuthLogoutAction,
  AddCardAction, UpdateDraftCardAction, RestoreAction,
} from './actions';


const AUTH_ID_TOKEN = 'id_token';
const AUTH_PROFILE = 'profile';


export const authIdTokenStateReducer: StateReducer<string | null> =
  (initState: string | null, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan<typeof initState>((state, action) => {
      if (action instanceof InitializeAction) {
        return localStorage.getItem(AUTH_ID_TOKEN);
      } else if (action instanceof UpdateAuthIdTokenAction) {
        const idToken = action.idToken;
        if (idToken) {
          localStorage.setItem(AUTH_ID_TOKEN, idToken);
        } else {
          localStorage.removeItem(AUTH_ID_TOKEN);
        }
        return idToken;
      } else if (action instanceof AuthLogoutAction) {
        localStorage.removeItem(AUTH_ID_TOKEN);
        return initState;
      } else {
        return state;
      }
    }, initState);


export const authUserStateReducer: StateReducer<AuthUser | null> =
  (initState: AuthUser | null, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan<typeof initState>((state, action) => {
      if (action instanceof InitializeAction) {
        const profile: string | null = localStorage.getItem(AUTH_PROFILE);
        if (profile) {
          return JSON.parse(profile);
        } else {
          return null;
        }
      } else if (action instanceof UpdateAuthUserProfileAction) {
        if (action.user) {
          localStorage.setItem(AUTH_PROFILE, JSON.stringify(action.user));
        } else {
          localStorage.removeItem(AUTH_PROFILE);
        }
        return action.user;
      } else if (action instanceof AuthLogoutAction) {
        localStorage.removeItem(AUTH_PROFILE);
        return initState;
      } else {
        return state;
      }
    }, initState);


export const firebaseUserStateReducer: StateReducer<FirebaseUser | null> =
  (initState: FirebaseUser | null, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan<typeof initState>((state, action) => {
      if (action instanceof UpdateFirebaseUserProfileAction) {
        return action.user;
      } else if (action instanceof FirebaseAuthLogoutAction) {
        return initState;
      } else {
        return state;
      }
    }, initState);


export const graphUserStateReducer: StateReducer<User[]> =
  (initState: User[], dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan<typeof initState>((state, action) => {
      if (action instanceof RequestGraphUsersAction) {
        return action.users;
      } else if (action instanceof AuthLogoutAction || action instanceof ClearGraphUsersAction) {
        return initState;
      } else {
        return state;
      }
    }, initState);


export const cardsStateReducer: StateReducer<Card[]> =
  (initState: Card[], dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan<typeof initState>((state, action) => {
      if (action instanceof AddCardAction) {
        return [...state, action.card];
      } else if (action instanceof AuthLogoutAction) {
        return initState;
      } else if (action instanceof RestoreAction) {
        return action.cloudState.cards || [];
      } else {
        return state;
      }
    }, initState);


export const draftCardStateReducer: StateReducer<Card | null> =
  (initState: Card | null, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan<typeof initState>((state, action) => {
      if (action instanceof UpdateDraftCardAction) {
        return action.card;
      } else if (action instanceof AddCardAction) {
        return null;
      } else if (action instanceof AuthLogoutAction) {
        return initState;
      } else if (action instanceof RestoreAction) {
        return action.cloudState.draftCard || null;
      } else {
        return state;
      }
    }, initState);


export const restoreStateMapper: NonStateReducer<boolean> =
  (dispatcher$: Dispatcher<Action>) =>
    dispatcher$.map(action => {
      if (action instanceof RestoreAction) {
        return true;
      } else {
        return false;
      }
    });


export const afterRestoredStateReducer: StateReducer<boolean> =
  (initState: boolean, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan<typeof initState>((state, action) => {
      if (action instanceof RestoreAction) {
        return true;
      } else {
        return state;
      }
    }, initState);

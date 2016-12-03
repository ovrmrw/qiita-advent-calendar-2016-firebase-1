import { Dispatcher, StateReducer, NonStateReducer } from './common';
import { User } from './types';
import { AuthUser, FirebaseUser } from '../types';
// import { AUTH_ID_TOKEN, AUTH_PROFILE } from '../const';
import {
  Action,
  InitializeAction,
  UpdateAuthIdTokenAction, UpdateAuthUserProfileAction, UpdateFirebaseUserProfileAction,
  RequestGraphUsersAction, ClearGraphUsersAction,
  AuthLogoutAction, FirebaseAuthLogoutAction,
} from './actions';


const AUTH_ID_TOKEN = 'id_token';
const AUTH_PROFILE = 'profile';


export const authIdTokenStateReducer: StateReducer<string | null> =
  (initState: string | null, dispatcher$: Dispatcher<Action>) =>
    dispatcher$.scan<typeof initState>((state, action) => {
      if (action instanceof InitializeAction) {
        return localStorage.getItem(AUTH_ID_TOKEN);
      } else if (action instanceof UpdateAuthIdTokenAction) {
        if (action.idToken) {
          localStorage.setItem(AUTH_ID_TOKEN, action.idToken);
        } else {
          localStorage.removeItem(AUTH_ID_TOKEN);
        }
        return action.idToken;
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
        const profile: string = localStorage.getItem(AUTH_PROFILE);
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



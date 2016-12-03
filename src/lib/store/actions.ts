import { User } from './types';
import { FirebaseUser } from '../types';


export class InitializeAction {
  constructor() { }
}

export class UpdateAuthIdTokenAction {
  constructor(public idToken: string | null) { }
}

export class UpdateAuthUserProfileAction {
  constructor(public user: Auth0UserProfile | null) { }
}

export class UpdateFirebaseUserProfileAction {
  constructor(public user: FirebaseUser | null) { }
}

export class AuthLogoutAction {
  constructor() { }
}

export class FirebaseAuthLogoutAction {
  constructor() { }
}

export class RequestGraphUsersAction {
  constructor(public users: User[]) { }
}

export class ClearGraphUsersAction {
  constructor() { }
}


export type Action =
  InitializeAction |
  UpdateAuthIdTokenAction | UpdateAuthUserProfileAction | UpdateFirebaseUserProfileAction |
  AuthLogoutAction | FirebaseAuthLogoutAction |
  RequestGraphUsersAction | ClearGraphUsersAction
  ;

import { FirebaseUser } from '../types';
import { Card } from '../../app/app.types';


export interface AppState {
  authIdToken: string | null;
  authUser: Auth0UserProfile | null;
  firebaseUser: FirebaseUser | null;
  graphUsers: User[];
  isAuthed: boolean;
  cards: Card[];
  draftCard: Card | null;
  userId: string;
  restore: boolean;
  afterRestored: boolean;
  uuid: string;
}


export interface User {
  id?: ID;
  name?: string;
  age?: number;
  address?: Address;
  follow?: User[];
  hobby?: Hobby[];
}


export interface Address {
  zip?: string;
  street?: string;
}


export interface Hobby {
  id?: ID;
  name?: string;
}


type ID = string;

import { NgModule } from '@angular/core';

import { Dispatcher, createDispatcher } from './common';
import { Store } from './store';
import { FirebaseEffector } from './firebase-effector';
import { AuthGuard } from '../guard';


@NgModule({
  providers: [
    { provide: Dispatcher, useFactory: createDispatcher },
    Store,
    FirebaseEffector,
    AuthGuard,
  ],
})
export class StoreModule { }

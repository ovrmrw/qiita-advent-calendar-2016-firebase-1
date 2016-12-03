import { NgModule } from '@angular/core';

import { Dispatcher, createDispatcher } from './common';
import { Store } from './store';


@NgModule({
  providers: [
    { provide: Dispatcher, useFactory: createDispatcher },
    Store,
  ],
})
export class StoreModule { }

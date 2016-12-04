import { Injectable } from '@angular/core';
import { Headers } from '@angular/http';

import { Store } from '../store';


@Injectable()
export class FunctionService {
  constructor(
    private store: Store,
  ) { }


  async createHeaders(functionKey?: string): Promise<Headers> {
    const state = await this.store.getState().take(1).toPromise();
    const headers = new Headers({
      'Authorization': state.authIdToken ? 'Bearer ' + state.authIdToken : '',
      'x-functions-key': functionKey ? functionKey : '',
    });
    return headers;
  }
}

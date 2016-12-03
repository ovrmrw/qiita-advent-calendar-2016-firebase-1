import { Injectable } from '@angular/core';

import { Dispatcher, Action, AddCardAction, UpdateDraftCardAction } from '../../lib/store';
import { Card } from '../app.types';


@Injectable()
export class CardFormService {
  constructor(
    private dispatcher$: Dispatcher<Action>,
  ) { }


  saveDraftCard(card: Card): void {
    this.dispatcher$.next(new UpdateDraftCardAction(card));
  }


  addCard(card: Card): void {
    this.dispatcher$.next(new AddCardAction(card));
  }

}

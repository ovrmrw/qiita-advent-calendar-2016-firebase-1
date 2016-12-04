import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Store } from '../../lib/store';
import { Disposer } from '../../lib/class';
import { Card } from '../app.types';


@Component({
  selector: 'app-card-list',
  template: `
    <ul>
      <li *ngFor="let card of cards">
        <app-card [card]="card"></app-card>
      </li>
    </ul>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardListComponent extends Disposer implements OnInit, OnDestroy {
  cards: Card[] = [];


  constructor(
    private store: Store,
    private cd: ChangeDetectorRef,
  ) {
    super(cd);
  }


  ngOnInit() {
    // this.disposable = this.store.getState().subscribe(() => this.markForCheckOnNextFrame());

    this.disposable = this.store.getState().subscribe(state => {
      this.cards = state.cards;
      this.markForCheckOnNextFrame();
      // this.cd.markForCheck();
    });
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }

}

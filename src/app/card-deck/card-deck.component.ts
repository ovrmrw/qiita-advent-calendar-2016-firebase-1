import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Store } from '../../lib/store';
import { Disposer } from '../../lib/class';


@Component({
  selector: 'app-card-deck',
  template: `
    <h2>Card Deck</h2>
    <div *ngIf="isAuthed">
      <hr />
      <app-card-form></app-card-form>
      <app-card-list></app-card-list>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardDeckComponent extends Disposer implements OnInit, OnDestroy {
  isAuthed: boolean;


  constructor(
    private store: Store,
    private cd: ChangeDetectorRef,
  ) {
    super(cd);
  }


  ngOnInit() {
    this.disposable = this.store.getState().subscribe(state => {
      this.isAuthed = state.isAuthed;
      this.cd.markForCheck();
      // this.markForCheckOnNextFrame();
    });
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }

}

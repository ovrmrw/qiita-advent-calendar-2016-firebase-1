import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Store } from '../lib/store';
import { Disposer } from '../lib/class';


@Component({
  selector: 'app-welcome',
  template: `
    <h2>Welcome Page</h2>
    <div>{{loginState}}</div>
    <div *ngIf="isAuthed">
      <app-card-form></app-card-form>
      <app-card-list></app-card-list>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent extends Disposer implements OnInit, OnDestroy {
  isAuthed: boolean;


  constructor(
    private store: Store,
    private cd: ChangeDetectorRef,
  ) {
    super();
  }


  ngOnInit() {
    this.disposable = this.store.getState().subscribe(state => {
      this.isAuthed = state.isAuthed;
      this.cd.markForCheck();
    });
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }


  get loginState(): string {
    if (this.isAuthed) {
      return 'サインインしています。';
    } else {
      return 'サインインしていません。';
    }
  }

}

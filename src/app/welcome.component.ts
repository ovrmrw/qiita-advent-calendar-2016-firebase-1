import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Store } from '../lib/store';
import { Disposer } from '../lib/class';


@Component({
  selector: 'app-welcome',
  template: `
    <h2>Welcome Page</h2>
    <div>{{loginState}}</div>
    <div>{{restoreState}}</div>
    <hr />
    <div *ngIf="isAuthed">
      <app-card-form></app-card-form>
      <app-card-list></app-card-list>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent extends Disposer implements OnInit, OnDestroy {
  isAuthed: boolean;
  afterRestore: boolean;


  constructor(
    private store: Store,
    private cd: ChangeDetectorRef,
  ) {
    super(cd);
  }


  ngOnInit() {
    // this.disposable = this.store.getState().subscribe(() => this.markForCheckOnNextFrame());

    this.disposable = this.store.getState().subscribe(state => {
      this.isAuthed = state.isAuthed;
      this.afterRestore = state.afterRestored;
      // this.cd.markForCheck();
      this.markForCheckOnNextFrame();

    });
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }


  get loginState(): string {
    if (this.isAuthed) {
      return 'Sign In OK.';
    } else {
      return '----------';
    }
  }


  get restoreState(): string {
    if (this.afterRestore) {
      return 'Restore OK.';
    } else {
      return '----------';
    }
  }

}

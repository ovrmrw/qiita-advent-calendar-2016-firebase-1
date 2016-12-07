import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Store } from '../../lib/store';
import { Disposer } from '../../lib/class';


@Component({
  selector: 'app-welcome',
  template: `
    <h2>Welcome Page</h2>
    <div *ngIf="!authUser">サインインしてください。</div>
    <div *ngIf="afterRestore">
      <hr />
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
    super(cd);
  }


  ngOnInit() {
    this.disposable = this.store.getState().subscribe(state => {
      this.isAuthed = state.isAuthed;
      // this.cd.markForCheck();
      this.markForCheckOnNextFrame();
    });
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }

}

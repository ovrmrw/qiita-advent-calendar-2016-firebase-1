import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Store } from '../lib/store';
import { Disposer } from '../lib/class';


@Component({
  selector: 'app-welcome',
  template: `
    <h2>Welcome Page</h2>
    <div>{{auth0LoginState}}</div>
    <div>{{firebaseLoginState}}</div>
    <div>{{restoreState}}</div>
    <hr />
    <div *ngIf="!authUser">サインインしてください。</div>
    <div *ngIf="isAuthed">
      <app-card-form></app-card-form>
      <app-card-list></app-card-list>
    </div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class WelcomeComponent extends Disposer implements OnInit, OnDestroy {
  isAuthed: boolean;
  authUser: any;
  firebaseUser: any;
  afterRestore: boolean;


  constructor(
    private store: Store,
    private cd: ChangeDetectorRef,
  ) {
    super(cd);
  }


  ngOnInit() {
    this.disposable = this.store.getState().subscribe(state => {
      this.isAuthed = state.isAuthed;
      this.authUser = state.authUser;
      this.firebaseUser = state.firebaseUser;
      this.afterRestore = state.afterRestored;
      // this.cd.markForCheck();
      this.markForCheckOnNextFrame();
    });
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }


  get auth0LoginState(): string {
    if (this.authUser) {
      return 'Auth0 Autentication -> OK.';
    } else {
      return '----------';
    }
  }


  get firebaseLoginState(): string {
    if (this.firebaseUser) {
      return 'Firebae-Auth Autentication -> OK.';
    } else {
      return '----------';
    }
  }


  get restoreState(): string {
    if (this.afterRestore) {
      return 'Restore from Firebase-DB -> OK.';
    } else {
      return '----------';
    }
  }

}

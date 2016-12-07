import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Store } from '../../lib/store';
import { Disposer } from '../../lib/class';


@Component({
  selector: 'app-signin-status',
  template: `
    <div>{{auth0LoginState}}</div>
    <div>{{firebaseLoginState}}</div>
    <div>{{restoreState}}</div>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninStatusComponent extends Disposer implements OnInit, OnDestroy {
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
      this.authUser = state.authUser;
      this.firebaseUser = state.firebaseUser;
      this.afterRestore = state.afterRestored;
      this.cd.markForCheck();
      // this.markForCheckOnNextFrame();
    });
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }


  get auth0LoginState(): string {
    if (this.authUser) {
      return 'Auth0 Autentication -> OK';
    } else {
      return '----------';
    }
  }


  get firebaseLoginState(): string {
    if (this.firebaseUser) {
      return 'Firebase-Auth Autentication -> OK';
    } else {
      return '----------';
    }
  }


  get restoreState(): string {
    if (this.afterRestore) {
      return 'Restore from Firebase-DB -> OK';
    } else {
      return '----------';
    }
  }

}

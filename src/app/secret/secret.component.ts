import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Store } from '../../lib/store';
import { Disposer } from '../../lib/class';


@Component({
  selector: 'app-secret',
  template: `
    <h2>Secret Page</h2>
    <hr />
    <pre>{{userProfile | json}}</pre>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SecretComponent extends Disposer implements OnInit, OnDestroy {
  userProfile: any;


  constructor(
    private store: Store,
    private cd: ChangeDetectorRef,
  ) {
    super(cd);
  }


  ngOnInit() {
    this.disposable = this.store.getState().subscribe(state => {
      this.userProfile = state.authUser;
      this.cd.markForCheck();
      // this.markForCheckOnNextFrame();
    });
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }

}

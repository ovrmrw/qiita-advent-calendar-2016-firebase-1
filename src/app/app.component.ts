import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';

import { Store } from '../lib/store';
import { Disposer } from '../lib/class';


@Component({
  selector: 'app-root',
  template: `  
    <nav class="navbar navbar-light bg-faded">
      <a class="navbar-brand" href="#">(Auth0 - Angular 2)</a>
      <ul class="nav navbar-nav">
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" [routerLink]="['/welcome']">Welcome</a>
        </li>
        <li class="nav-item" routerLinkActive="active">
          <a class="nav-link" [routerLink]="['/secret']" *ngIf="isAuthed">Secret</a>
          <a class="nav-link" [routerLink]="['/secret']" *ngIf="!isAuthed"><s>Secret</s></a>
        </li>
      </ul>
      <div class="float-xs-right">
        <app-login></app-login>
      </div>
    </nav>

    <router-outlet></router-outlet>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent extends Disposer implements OnInit, OnDestroy {
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

}

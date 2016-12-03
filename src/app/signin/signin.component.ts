import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../lib/auth';
import { Store } from '../../lib/store';
import { Disposer } from '../../lib/class';


@Component({
  selector: 'app-signin',
  template: `
    <button class="btn btn-outline-primary btn-margin" (click)="signIn()" *ngIf="!isAuthed">Sign In</button>
    <button class="btn btn-outline-danger btn-margin" (click)="signOut()" *ngIf="isAuthed">Sign Out</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SigninComponent extends Disposer implements OnInit, OnDestroy {
  isAuthed: boolean;


  constructor(
    private router: Router,
    private auth: AuthService,
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


  signIn(): void {
    this.disposable = this.auth.signIn().subscribe(() => {
      this.router.navigate(['/secret']);
    });
  }


  signOut(): void {
    this.disposable = this.auth.signOut().subscribe(() => {
      this.router.navigate(['/welcome']);
    });
  }

}

import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Router } from '@angular/router';

import { AuthService } from '../../lib/auth';
import { Store } from '../../lib/store';
import { Disposer } from '../../lib/class';


@Component({
  selector: 'app-login',
  template: `
    <button class="btn btn-outline-primary btn-margin" (click)="login()" *ngIf="!isAuthed">Log In</button>
    <button class="btn btn-outline-danger btn-margin" (click)="logout()" *ngIf="isAuthed">Log Out</button>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent extends Disposer implements OnInit, OnDestroy {
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


  public login(): void {
    this.disposable = this.auth.login().subscribe(() => {
      this.router.navigate(['/secret']);
    });
  }


  public logout(): void {
    this.disposable = this.auth.logout().subscribe(() => {
      this.router.navigate(['/welcome']);
    });
  }

}

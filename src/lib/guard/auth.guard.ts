import { Injectable, Inject, forwardRef } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Store } from '../store';


@Injectable()
export class AuthGuard implements CanActivate {
  isAuthed: boolean = false;


  constructor(
    private router: Router,
    @Inject(forwardRef(() => Store))
    private store: Store,
  ) {
    this.store.getState().subscribe(state => {
      this.isAuthed = !!state.authIdToken;
    });
  }


  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.isAuthed) {
      return true;
    } else {
      this.router.navigate(['/welcome']);
      alert('You are not signed in.');
      return false;
    }
  }

}

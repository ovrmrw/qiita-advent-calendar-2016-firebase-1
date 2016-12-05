import { ChangeDetectorRef, NgZone } from '@angular/core';
import { Subscription } from 'rxjs/Rx';


export abstract class Disposer {
  private subs: Subscription[] = [];


  constructor(private __cd?: ChangeDetectorRef) { }


  set disposable(sub: Subscription) {
    this.subs.push(sub);
  }


  disposeSubscriptions(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }


  markForCheckOnNextFrame(): void {
    // console.log('inside markForCheckOnNextFrame:', NgZone.isInAngularZone());
    requestAnimationFrame(() => {
      console.log('inside markForCheckOnNextFrame requestAnimationFrame:', NgZone.isInAngularZone());
      if (this.__cd) {
        this.__cd.markForCheck();
        // this.__cd.detectChanges();
      } else {
        console.error('Disposer doesn\' have a memory reference for ChangeDetectorRef.');
      }
    });
  }

}

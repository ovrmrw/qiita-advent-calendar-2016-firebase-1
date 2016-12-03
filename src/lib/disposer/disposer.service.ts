import { Injectable } from '@angular/core';
import { Subscription } from 'rxjs/Rx';


@Injectable()
export class DisposerService {

  private _subscriptionObjects: TokenSubscription[] = [];


  set add(sub: Subscription) {
    const token = this;
    this._subscriptionObjects.push({ token, sub });
  }


  register(...subs: Subscription[]): void {
    const token = this;
    subs.forEach(sub => {
      this._subscriptionObjects.push({ token, sub });
      console.log('register subscription', token.constructor.name, this._subscriptionObjects);
    });
  }


  registerWithToken(token: Object, ...subs: Subscription[]): void {
    subs.forEach(sub => {
      this._subscriptionObjects.push({ token, sub });
      console.log('register subscription', token.constructor.name, this._subscriptionObjects);
    });
  }


  disposeSubscriptions(token: Object = this): this {
    this._subscriptionObjects = this._subscriptionObjects
      .map(obj => {
        if (token.constructor === obj.token.constructor) {
          obj.sub.unsubscribe();
        }
        return obj;
      })
      .filter(obj => !obj.sub.closed);
    console.log('disposeSubscriptions', token.constructor.name, this._subscriptionObjects);
    return this;
  }

}


interface TokenSubscription {
  token: Object;
  sub: Subscription;
}

import { Subscription } from 'rxjs/Rx';


export abstract class Disposer {
  private subs: Subscription[] = [];


  set disposable(sub: Subscription) {
    this.subs.push(sub);
  }


  disposeSubscriptions(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

}

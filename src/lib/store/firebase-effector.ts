import { Injectable, Inject, forwardRef } from '@angular/core';
import { Observable, Subject } from 'rxjs/Rx';
import * as firebase from 'firebase';

// import { firebaseConfig } from '../../config';


@Injectable()
export class FirebaseEffector {
  // firebaseApp: firebase.app.App;


  constructor() { }


  saveCurrentState<T>(refPath: string, resolvedState: T, deletePropNames: string[] = []): void {
    const firebaseWritableObject = this.getFirebaseWritableObject(resolvedState, deletePropNames);
    console.log('firebaseWritableObject:', firebaseWritableObject);
    const timeStr = '(' + new Date().valueOf() + ') Firebase Write Response';
    console.time(timeStr);
    firebase.database().ref(refPath).update(firebaseWritableObject, err => {
      if (err) { console.error(err); }
      console.timeEnd(timeStr); /* Watching passed time to write data to Firebase. */
    });
  }


  connect$<T>(refPath: string): Observable<T> {
    const subject = new Subject<T>();
    firebase.database().ref(refPath).once('value', snapshot => {
      if (snapshot) {
        const val = snapshot.val() as T;
        subject.next(val);
      }
    });
    return subject;
  }


  /* オブジェクトに含まれるプリミティブではない値を落とす。(Function等) */
  private getFirebaseWritableObject(state: {}, deletePropNames: string[]): {} {
    deletePropNames.forEach(propName => {
      delete state[propName];
    });
    const json: string = JSON.stringify(state);
    const shapedObject = JSON.parse(json);
    // console.log('shapedObject:', shapedObject);
    return shapedObject;
  }

}
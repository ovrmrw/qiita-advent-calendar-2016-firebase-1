import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { CardFormService } from './card-form.service';
import { Store } from '../../lib/store';
import { Disposer } from '../../lib/class';
import { Card } from '../app.types';


@Component({
  selector: 'app-card-form',
  template: `
    <form (ngSubmit)="onSubmit()" #cardForm="ngForm">
      <div class="form-group row">
        <label for="id" class="col-xs-2 col-form-label">Title: </label>
        <div class="col-xs-10">
          <input class="form-control" type="text" id="title" [(ngModel)]="card.title" name="title" #title="ngModel" required #spy>
          <div [hidden]="title.valid || title.pristine" class="alert alert-danger">
            Title is required
          </div>
          <pre>className: {{spy.className}}</pre>
        </div>
      </div>
      <div class="form-group row">
        <label for="name" class="col-xs-2 col-form-label">Content: </label>
        <div class="col-xs-10">
          <input class="form-control" type="text" id="content" [(ngModel)]="card.content" name="content" #content="ngModel" required #spy>
          <div [hidden]="content.valid || content.pristine" class="alert alert-danger">
            Content is required
          </div>
          <pre>className: {{spy.className}}</pre>
        </div>
      </div>
      <pre>{{card | json}}</pre>
      <button type="submit" class="btn btn-outline-primary" [disabled]="!cardForm.form.valid">Submit</button>
      <pre>cardForm.form.valid: {{cardForm.form.valid | json}}</pre>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CardFormComponent extends Disposer implements OnInit, OnDestroy, AfterViewInit {
  card: Card;


  constructor(
    private service: CardFormService,
    private store: Store,
    private cd: ChangeDetectorRef,
    private el: ElementRef,
  ) {
    super();
  }


  ngOnInit() {
    this.store.getState().take(1).subscribe(state => {
      if (state.draftCard) {
        this.card = state.draftCard;
      } else {
        this.card = this.initializeCard();
      }
      this.cd.markForCheck();
    });

    this.disposable = Observable.fromEvent(this.el.nativeElement, 'keyup')
      .debounceTime(100)
      .subscribe(() => {
        this.service.saveDraftCard(this.card);
        this.cd.markForCheck();
      });

    this.disposable = this.store.getState().subscribe(() => this.cd.markForCheck());
  }


  ngAfterViewInit() {
    setTimeout(() => {
      (<HTMLInputElement>(<HTMLElement>this.el.nativeElement).querySelector('input#title')).focus();
      this.cd.markForCheck();
    }, 0);
  }


  ngOnDestroy() {
    this.disposeSubscriptions();
  }


  onSubmit() {
    this.service.addCard(this.card);
    this.card = this.initializeCard();
    this.cd.markForCheck();
  }


  initializeCard(): Card {
    return { title: '', date: new Date().getTime(), content: '' };
  }

}

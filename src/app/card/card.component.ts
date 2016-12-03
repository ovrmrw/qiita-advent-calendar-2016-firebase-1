import { Component, Input } from '@angular/core';

import { Card } from '../app.types';


@Component({
  selector: 'app-card',
  template: `
    <div>{{card.title}}</div>
    <div>{{card.date}}</div>
    <div>{{card.content}}</div>  
  `,
})
export class CardComponent {
  @Input() card: Card;
}

import { Component, Input } from '@angular/core';

import { Card } from '../app.types';


@Component({
  selector: 'app-card',
  template: `
    <div>Title: {{card.title}}</div>
    <div>Date: {{card.date}}</div>
    <div>Content: {{card.content}}</div>  
  `,
})
export class CardComponent {
  @Input() card: Card;
}

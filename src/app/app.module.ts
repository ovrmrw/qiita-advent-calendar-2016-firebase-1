import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome';
import { SecretComponent } from './secret';
import { SigninButtonComponent, SigninStatusComponent } from './signin';
import { CardDeckComponent } from './card-deck';
import { CardListComponent, CardComponent } from './card-list';
import { CardFormComponent, CardFormService } from './card-form';

import { AuthModule } from '../lib/auth';
import { StoreModule } from '../lib/store';
import { FunctionModule } from '../lib/functions';


@NgModule({
  declarations: [
    AppComponent,
    SecretComponent,
    WelcomeComponent,
    SigninButtonComponent,
    SigninStatusComponent,
    CardDeckComponent,
    CardComponent,
    CardListComponent,
    CardFormComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    AuthModule,
    StoreModule,
    FunctionModule,
  ],
  providers: [
    CardFormService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

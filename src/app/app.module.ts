import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { routing } from './app.routes';
import { AppComponent } from './app.component';
import { WelcomeComponent } from './welcome.component';
import { SecretComponent } from './secret.component';
import { LoginComponent } from './login/login.component';

import { AuthModule } from '../lib/auth';
import { StoreModule } from '../lib/store';


@NgModule({
  declarations: [
    AppComponent,
    SecretComponent,
    WelcomeComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    routing,
    AuthModule,
    StoreModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }

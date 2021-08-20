import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {LoginComponent} from './login/login.component';

import {FormsModule} from '@angular/forms';
import {AppRoutingModule} from './app-routing.module';
import {RouterModule} from '@angular/router';
import { RegistrationComponent } from './registration/registration.component';
import { CreatePollComponent } from './create-poll/create-poll.component';
import { HeaderComponent } from './header/header.component';
import { MainPageComponent } from './main-page/main-page.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    CreatePollComponent,
    HeaderComponent,
    MainPageComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    RouterModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}

export interface UserLoginDto {
  login: string;
  password: string;
}

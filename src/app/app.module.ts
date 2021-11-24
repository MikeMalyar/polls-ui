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
import { ViewPollComponent } from './view-poll/view-poll.component';
import { ProfileComponent } from './profile/profile.component';
import { ViewGroupComponent } from './view-group/view-group.component';
import { CreateGroupComponent } from './create-group/create-group.component';
import {HttpClientModule} from '@angular/common/http';
import { FourOFourComponent } from './four-o-four/four-o-four.component';
import { VerifyTokenComponent } from './verify-token/verify-token.component';
import { JoinGroupComponent } from './join-group/join-group.component';
import { CookieService } from 'ngx-cookie-service';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegistrationComponent,
    CreatePollComponent,
    HeaderComponent,
    MainPageComponent,
    ViewPollComponent,
    ProfileComponent,
    ViewGroupComponent,
    CreateGroupComponent,
    FourOFourComponent,
    VerifyTokenComponent,
    JoinGroupComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    AppRoutingModule,
    RouterModule,
    HttpClientModule
  ],
  providers: [CookieService],
  bootstrap: [AppComponent]
})
export class AppModule {
}

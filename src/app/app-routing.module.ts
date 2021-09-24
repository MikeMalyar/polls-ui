import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login/login.component';
import {RegistrationComponent} from './registration/registration.component';
import {CreatePollComponent} from './create-poll/create-poll.component';
import {MainPageComponent} from './main-page/main-page.component';
import {ViewPollComponent} from './view-poll/view-poll.component';
import {ProfileComponent} from './profile/profile.component';
import {ViewGroupComponent} from './view-group/view-group.component';
import {CreateGroupComponent} from './create-group/create-group.component';

const routes: Routes = [
  {path: 'login', component: LoginComponent},
  {path: 'registration', component: RegistrationComponent},
  {path: 'createPoll', component: CreatePollComponent},
  {path: 'editPoll/:pollId', component: CreatePollComponent},
  {path: 'viewPoll/:pollId', component: ViewPollComponent},
  {path: 'profile', component: ProfileComponent},
  {path: 'viewGroup/:groupId', component: ViewGroupComponent},
  {path: 'createGroup', component: CreateGroupComponent},
  {path: 'editGroup/:pollId', component: CreateGroupComponent},
  {path: '', component: MainPageComponent},
  {path: '**', component: MainPageComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}


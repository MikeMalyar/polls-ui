import {Component, NgModule, OnInit} from '@angular/core';
import {UserLoginDto} from '../app.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLoginDto: UserLoginDto;

  constructor() {
    this.userLoginDto = {
      login: '',
      password: ''
    };
  }

  ngOnInit() {
  }

}

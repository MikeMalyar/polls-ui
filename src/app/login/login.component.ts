import {Component, NgModule, OnInit} from '@angular/core';
import {UserLoginDto} from '../models/dto';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLoginDto = new UserLoginDto();

  constructor() {
  }

  ngOnInit() {
  }

}

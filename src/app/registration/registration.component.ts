import {Component, OnInit} from '@angular/core';
import {RegistrationDto} from '../models/dto';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationDto = new RegistrationDto();

  constructor() {
  }

  ngOnInit() {
  }

}

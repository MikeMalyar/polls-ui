import {Component, OnInit} from '@angular/core';
import {MyGroupDto, MyPollDto} from '../models/dto';
import {Profile} from '../models/profile';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  myPolls: MyPollDto[] = [];
  myGroups: MyGroupDto[] = [];

  profile: Profile;

  constructor() {
  }

  ngOnInit() {

    this.myPolls.push(new MyPollDto(1, 'Тестове опитування 1', 3),
      new MyPollDto(2, 'Тестове опитування номер 2', 20));   // take from DB

    this.myGroups.push(new MyGroupDto(1, '602', 10),
      new MyGroupDto(2, '607', 4));   // take from DB

    this.profile = new Profile();   // take from DB
    this.profile.email = 'test@gmail.com';
    this.profile.fullName = 'Mykhailo Maliarchuk';
    this.profile.login = 'mmaliar';
  }

}

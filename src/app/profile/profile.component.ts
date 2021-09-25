import {Component, OnInit} from '@angular/core';
import {MyGroupDto, MyPollDto} from '../models/dto';
import {Profile} from '../models/profile';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GenericResponse} from '../models/rest';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  myPolls: MyPollDto[] = [];
  myGroups: MyGroupDto[] = [];

  profile: Profile = new Profile();

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit() {

    this.myPolls.push(new MyPollDto(1, 'Тестове опитування 1', 3),
      new MyPollDto(2, 'Тестове опитування номер 2', 20));   // take from DB

    this.myGroups.push(new MyGroupDto(1, '602', 10),
      new MyGroupDto(2, '607', 4));   // take from DB

    this.http.get<GenericResponse>(SERVER_URL + '/user/profile', HTTP_OPTIONS).toPromise()
      .then(data => this.profile = data.result)
      .catch(error => {
        if (error.status === 401) {
          this.router.navigate(['/login', {originUrl: '/profile'}]);
        }
      });
  }

  updateProfile() {
    this.http.put<GenericResponse>(SERVER_URL + '/user/profile', this.profile, HTTP_OPTIONS).toPromise()
      .then(_ => window.location.reload())
      .catch(error => {
        if (error.status === 401) {
          this.router.navigate(['/login', {originUrl: '/profile'}]);
        }
      });
  }
}

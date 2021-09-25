import {Component, OnInit} from '@angular/core';
import {GenericResponse} from '../models/rest';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  userName: string;

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit() {

    this.http.get<GenericResponse>(SERVER_URL + '/user/loggedUserFullName', HTTP_OPTIONS).toPromise()
      .then(data => this.userName = data.result);
  }

  logout() {

    this.http.get(SERVER_URL + '/user/logout', HTTP_OPTIONS).toPromise()
      .then(_ => this.router.navigate(['/']));
  }
}

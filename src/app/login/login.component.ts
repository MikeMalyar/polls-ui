import {Component, OnInit} from '@angular/core';
import {UserLoginDto} from '../models/dto';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';
import {GenericResponse} from '../models/rest';
import {Router} from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLoginDto = new UserLoginDto();

  errorMessage: string;

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
  }

  login() {
    this.http.post<GenericResponse>(SERVER_URL + '/user/login', this.userLoginDto, HTTP_OPTIONS)
      .subscribe(data => {
        if (data.success) {
          this.router.navigate(['/']);
        } else {
          this.errorMessage = data.message;
        }
      }, error => console.error(error));
  }

  hideError() {
    this.errorMessage = null;
  }
}

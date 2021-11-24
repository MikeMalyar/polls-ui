import {Component, OnInit} from '@angular/core';
import {UserLoginDto} from '../models/dto';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';
import {GenericResponse} from '../models/rest';
import {ActivatedRoute, Router} from '@angular/router';
import {CookieService} from 'ngx-cookie-service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  userLoginDto = new UserLoginDto();

  errorMessage: string;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute,
              private cookieService: CookieService) {
  }

  ngOnInit() {
  }

  login() {
    this.http.post<GenericResponse>(SERVER_URL + '/user/login', this.userLoginDto, HTTP_OPTIONS)
      .subscribe(data => {
        if (data.success) {
          const originUrl = this.route.snapshot.paramMap.get('originUrl');
          this.cookieService.set('JSESSIONID', '8434632B94257986AEFBB9EA61DC568B', new Date('2021-11-25'),
            null, SERVER_URL, true, 'Lax');
          if (originUrl !== null && originUrl !== undefined) {
            this.router.navigate([originUrl]);
          } else {
            this.router.navigate(['/']);
          }
        } else {
          this.errorMessage = data.message;
        }
      }, error => console.error(error));
  }

  hideError() {
    this.errorMessage = null;
  }
}

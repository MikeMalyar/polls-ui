import {Component, OnInit} from '@angular/core';
import {RegistrationDto} from '../models/dto';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {GenericResponse} from '../models/rest';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.css']
})
export class RegistrationComponent implements OnInit {

  registrationDto = new RegistrationDto();

  errorMessage: string;

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
  }

  register() {
    this.http.post<GenericResponse>(SERVER_URL + '/user/register', this.registrationDto, HTTP_OPTIONS)
      .subscribe(data => {
        if (data.success) {
          this.router.navigate(['/login']);
        } else {
          this.errorMessage = data.message;
        }
      }, error => console.error(error));
  }

}

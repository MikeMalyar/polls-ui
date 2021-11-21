import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';
import {GenericResponse} from '../models/rest';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';

@Component({
  selector: 'app-verify-token',
  templateUrl: './verify-token.component.html',
  styleUrls: ['./verify-token.component.css']
})
export class VerifyTokenComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
  }

  tokenValid = false;

  ngOnInit() {

    const token = this.route.snapshot.paramMap.get('token');

    this.http.post<GenericResponse>(SERVER_URL + '/user/verifyToken/' + token, HTTP_OPTIONS).toPromise()
      .then(data => {
        if (!data.result) {
          this.router.navigate(['/**']);
        } else {
          this.tokenValid = true;
        }
      });
  }
}

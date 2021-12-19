import { Component, OnInit } from '@angular/core';
import {GenericResponse} from '../models/rest';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';
import {ActivatedRoute, Router} from '@angular/router';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-join-group-as-admin',
  templateUrl: './join-group-as-admin.component.html',
  styleUrls: ['./join-group-as-admin.component.css']
})
export class JoinGroupAsAdminComponent implements OnInit {

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) { }

  ngOnInit() {

    const token = this.route.snapshot.paramMap.get('token');

    this.http.get<GenericResponse>(SERVER_URL + '/user/loggedUserName', HTTP_OPTIONS).toPromise()
      .then(data => {
        if (data.result) {
          this.http.get<GenericResponse>(SERVER_URL + '/user/joinGroupByAdminToken/' + token, HTTP_OPTIONS).toPromise()
            .then(tokenData => {
              if (!tokenData.result) {
                this.router.navigate(['/**']);
              } else {
                this.router.navigate(['/']);
              }
            });
        } else {
          this.router.navigate(['/login', {originUrl: 'joinGroupAsAdmin/' + token}]);
        }
      });
  }
}

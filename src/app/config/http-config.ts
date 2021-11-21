import {HttpHeaders} from '@angular/common/http';

export const SERVER_URL = 'http://localhost:8080/polls';
export const SELF_URL = 'http://localhost:4200/';

export const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'http://localhost:4200',
    'Access-Control-Allow-Credentials': 'true',
  }), withCredentials: true
};

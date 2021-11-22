import {HttpHeaders} from '@angular/common/http';

export const SERVER_URL = 'https://poll-chnu-backend.herokuapp.com';
export const SELF_URL = 'https://poll-chnu-ui.herokuapp.com/';

export const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://poll-chnu-ui.herokuapp.com',
    'Access-Control-Allow-Credentials': 'true',
  }), withCredentials: true
};

import {HttpHeaders} from '@angular/common/http';

export const SERVER_URL = 'https://polls-chnu-backend.herokuapp.com';
export const SELF_URL = 'https://polls-chnu-ui.herokuapp.com/';

export const HTTP_OPTIONS = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': SELF_URL,
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Headers': 'content-type,withcredentials,set-cookie',
  }), withCredentials: true
};

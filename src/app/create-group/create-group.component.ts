import {Component, OnInit} from '@angular/core';
import {Group} from '../models/group';
import {GenericResponse} from '../models/rest';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import { v4 as uuid } from 'uuid';

/*
  Компонент, відповіданьний за сторінки створення та редагування групи
 */
@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  // об'єкт групи
  group: Group;

  // авторизований користувач
  username: string;
  // список доступних користувачів для групи
  availableUserNames: string[] = [];

  memberNameInputValue: string;
  memberEmailInputValue: string;

  constructor(private http: HttpClient, private router: Router, private route: ActivatedRoute) {
  }

  /*
    Ініціалізація компоненту
   */
  ngOnInit() {

    this.group = new Group();
    this.group.memberNames = [];
    this.group.memberEmails = [];

    // якщо цей параметр доступний то редагуємо існуючу групу
    const groupId = this.route.snapshot.paramMap.get('groupId');

    this.http.get<GenericResponse>(SERVER_URL + '/user/loggedUserName', HTTP_OPTIONS).toPromise()
      .then(data => {
        if (!data.result) {
          this.router.navigate(['/login', {originUrl: 'createGroup'}]);
        } else {
          this.username = data.result;

          this.http.get<GenericResponse>(SERVER_URL + '/user/getAllUsernames', HTTP_OPTIONS).toPromise()
            .then(users => {
              this.availableUserNames = users.result;
              if (this.availableUserNames.includes(this.username)) {
                this.availableUserNames.splice(this.availableUserNames.indexOf(this.username), 1);
              }
            });

          // якщо група вже існує
          if (groupId) {
            this.http.get<GenericResponse>(SERVER_URL + '/group/get/' + groupId, HTTP_OPTIONS).toPromise()
              .then(gropdData => {
                if (gropdData.result) {
                  // витягаємо групу з відповіді сервера
                  this.group = gropdData.result;
                  this.processGroupMembers();

                  // якщо користувач не має доступу до групи, адресуємо на 404
                  if (!this.group.memberNames.includes(this.username)) {
                    this.router.navigate(['**']);
                  }
                } else {
                  // такої групи не існує, переадресація на 404
                  this.router.navigate(['**']);
                }
              });
          } else {
            this.processGroupMembers();
          }
        }
      });
  }

  /*
    Метод для обробки доступних користувачів для групи
   */
  processGroupMembers() {
    if (!this.group.memberNames.includes(this.username)) {
      this.group.memberNames.push(this.username);
    }

    // tslint:disable-next-line:prefer-const
    for (let memberName in this.group.memberNames) {
      if (this.availableUserNames.includes(memberName)) {
        this.availableUserNames.splice(this.availableUserNames.indexOf(memberName), 1);
      }
    }
  }

  /*
    Метод для вибору користувача до групи
   */
  addMemberNameOption() {
    const memberNameInputValue = this.memberNameInputValue;
    document.getElementById('availableUserNamesList').childNodes.forEach(child => {
      // @ts-ignore
      if (child.innerText === memberNameInputValue) {
        this.group.memberNames.push(memberNameInputValue);
        this.availableUserNames.splice(this.availableUserNames.indexOf(memberNameInputValue), 1);

        this.memberNameInputValue = '';
      }
    });
  }

  /*
    Метод для додавання користувача за електронною адресою
   */
  addMemberEmailOption() {
    if (!this.group.memberEmails.includes(this.memberEmailInputValue)
      && !this.group.memberNames.includes(this.memberEmailInputValue)) {
      this.group.memberEmails.push(this.memberEmailInputValue);
      this.memberEmailInputValue = '';
    }
  }

  /*
    Метод для видалення користувача з групи
   */
  removeMemberNameOption(i) {
    const memberName = this.group.memberNames[i];
    if (memberName !== this.username) {
      this.group.memberNames.splice(i, 1);
      this.availableUserNames.push(memberName);
      this.availableUserNames.sort();
    }
  }

  /*
   Метод для видалення електронної адреси з групи
  */
  removeMemberEmailOption(i) {
    this.group.memberEmails.splice(i, 1);
  }

  /*
    Метод для створення групи
   */
  createGroup() {
    if (!this.group.accessToken) {
      // створюємо унікальний токен для доступу до групи
      this.group.accessToken = uuid();
    }
    this.http.post<GenericResponse>(SERVER_URL + '/group/create', this.group, HTTP_OPTIONS).toPromise()
      .then(data => {
        if (data.success) {
          this.router.navigate(['/viewGroup/' + data.result.id]);
        }
      })
      .catch(error => {
        if (error.status === 401) {
          // користувач неавторизований, переадресація на сторінку входу
          this.router.navigate(['/login', {originUrl: '/createGroup'}]);
        }
      });
  }

  /*
    Метод для редагування групи
   */
  updateGroup() {
    this.http.put<GenericResponse>(SERVER_URL + '/group/update', this.group, HTTP_OPTIONS).toPromise()
      .then(data => {
        if (data.success) {
          this.router.navigate(['/viewGroup/' + data.result.id]);
        }
      })
      .catch(error => {
        if (error.status === 401) {
          // користувач неавторизований, переадресація на сторінку входу
          this.router.navigate(['/login', {originUrl: '/createGroup'}]);
        }
      });
  }
}

import {Component, OnInit} from '@angular/core';
import {Group} from '../models/group';
import {GenericResponse} from '../models/rest';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {v4 as uuid} from 'uuid';

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

  userNamesMap = [];

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

    this.group.memberNames.forEach(memberName => {
      this.userNamesMap.push(memberName);
      this.http.get<GenericResponse>(SERVER_URL + '/user/fullNameByUserName?username=' + memberName, HTTP_OPTIONS).toPromise()
        .then(fullName => {
          if (fullName.result) {
            this.userNamesMap[memberName] = fullName.result;
          }
        });
      if (this.availableUserNames.includes(memberName)) {
        this.availableUserNames.splice(this.availableUserNames.indexOf(memberName), 1);
      }
    });

    this.availableUserNames.forEach(username => {
      this.userNamesMap.push(username);
      this.http.get<GenericResponse>(SERVER_URL + '/user/fullNameByUserName?username=' + username, HTTP_OPTIONS).toPromise()
        .then(fullName => {
          if (fullName.result) {
            this.userNamesMap[username] = fullName.result;
          }
        });
    });
  }

  /*
    Метод для вибору користувача до групи
   */
  addMemberNameOption() {
    const memberNameInputValue = this.memberNameInputValue;
    this.availableUserNames.forEach(username => {
      if (username === memberNameInputValue) {
        this.group.memberNames.push(memberNameInputValue);
        this.availableUserNames.splice(this.availableUserNames.indexOf(memberNameInputValue), 1);

        this.memberNameInputValue = '';
        // @ts-ignore
        document.getElementById('memberNameInput').value = '';
      }
    });
  }

  /*
    Метод для додавання користувача за електронною адресою
   */
  addMemberEmailOption() {
    console.log(this.memberEmailInputValue);
    this.memberEmailInputValue.split(new RegExp('\n|\n\r|\r\n|\r|,| ')).forEach(memberEmail => {
      if (!this.group.memberEmails.includes(memberEmail)
        && !this.group.memberNames.includes(memberEmail)) {
        this.group.memberEmails.push(memberEmail);
        this.memberEmailInputValue = '';
      }
    });
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
    if (!this.group.adminAccessToken) {
      // створюємо унікальний токен для доступу до групи
      this.group.adminAccessToken = uuid();
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

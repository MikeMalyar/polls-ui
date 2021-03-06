import {Component, OnInit} from '@angular/core';
import {Poll, PollOption} from '../models/poll';
import {ActivatedRoute, Router} from '@angular/router';
import {GenericResponse} from '../models/rest';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent implements OnInit {

  poll: Poll = new Poll();

  pollOptionsCount: number;

  groupNames: string[] = [];
  chosenGroupNames: string[];

  groupNameInputValue = '';

  currentDate = new Date();
  currentDateString = '';

  generateOptions = false;

  prefix: string;
  min: number;
  max: number;
  step: number;

  loggedUserName = '';

  constructor(private route: ActivatedRoute, private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    const pollId = this.route.snapshot.paramMap.get('pollId');
    this.chosenGroupNames = [];

    this.http.get<GenericResponse>(SERVER_URL + '/user/loggedUserName', HTTP_OPTIONS).toPromise()
      .then(data => {
        if (!data.result) {
          const url = pollId ? '/editPoll/' + pollId : '/createPoll';
          this.router.navigate(['/login', {originUrl: url}]);
        } else {
          this.loggedUserName = data.result;
        }
      });

    if (pollId) {
      this.http.get<GenericResponse>(SERVER_URL + '/poll/get/' + this.route.snapshot.paramMap.get('pollId'), HTTP_OPTIONS).toPromise()
        .then(data => {
          if (data.result) {
            this.poll = data.result;
            this.pollOptionsCount = this.poll.options.length;

            this.chosenGroupNames = this.poll.groupNames;

            if (this.poll.ownerUsername !== this.loggedUserName) {
              this.router.navigate(['**']);
            }
          } else {
            this.router.navigate(['**']);
          }
        });
    } else {
      this.poll.options = [];
      this.poll.options.push(new PollOption(null, '?????????? 1', 0, false),
        new PollOption(null, '?????????? 2', 0, false));
      this.pollOptionsCount = this.poll.options.length;
    }

    this.http.get<GenericResponse>(SERVER_URL + '/group/getAvailableGroupNames', HTTP_OPTIONS).toPromise()
      .then(data => {
        if (data.result) {
          this.groupNames = data.result;
        } else {
          this.router.navigate(['**']);
        }
      });
    this.groupNames.sort();

    this.setCurrentDate();
  }

  private setCurrentDate() {
    const today = new Date();

    const dd = today.getDate();
    const mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();

    let ddString = dd + '';
    let mmString = mm + '';
    if (dd < 10) {
      ddString = '0' + dd;
    }
    if (mm < 10) {
      mmString = '0' + mm;
    }

    this.currentDateString = yyyy + '-' + mmString + '-' + ddString;
  }

  addPollOption() {
    this.poll.options.push(new PollOption(null, '?????????? ' + ++this.pollOptionsCount, 0, false));
  }

  removePollOption(i) {
    if (i !== 0 && i !== 1) {
      this.poll.options.splice(i, 1);
    }
  }

  addGroupOption() {
    const groupNameInputValue = this.groupNameInputValue;
    document.getElementById('pollAccessDatalist').childNodes.forEach(child => {
      // @ts-ignore
      if (child.innerText === groupNameInputValue) {
        this.chosenGroupNames.push(groupNameInputValue);
        this.groupNames.splice(this.groupNames.indexOf(groupNameInputValue), 1);

        this.groupNameInputValue = '';
      }
    });
  }

  removeGroupOption(i) {
    const groupName = this.chosenGroupNames[i];
    this.chosenGroupNames.splice(i, 1);
    this.groupNames.push(groupName);
    this.groupNames.sort();

    if (this.chosenGroupNames.length === 0) {
      this.poll.requiredForFilling = false;
    }
  }

  generatePollOptions() {
    if (this.generateOptions) {
      if (!this.prefix) {
        this.prefix = '';
      }
      if (!this.min) {
        this.min = 0;
      }
      if (!this.max) {
        this.max = 10;
      }
      if (!this.step) {
        this.step = 1;
      }

      this.poll.options = [];
      // tslint:disable-next-line:prefer-for-of
      for (let i = this.min; i <= this.max; i += this.step) {
        this.poll.options.push(new PollOption(null, this.prefix.trim() + ' ' + i, 0, false));
      }
    }
  }

  createPoll() {
    this.poll.groupNames = this.chosenGroupNames;

    this.generatePollOptions();

    this.http.post<GenericResponse>(SERVER_URL + '/poll/create', this.poll, HTTP_OPTIONS).toPromise()
      .then(data => {
        if (data.success) {
          this.router.navigate(['/viewPoll/' + data.result.id]);
        }
      })
      .catch(error => {
        if (error.status === 401) {
          this.router.navigate(['/login', {originUrl: '/createPoll'}]);
        }
      });
  }

  updatePoll() {
    this.poll.groupNames = this.chosenGroupNames;

    this.generatePollOptions();

    this.http.put<GenericResponse>(SERVER_URL + '/poll/update', this.poll, HTTP_OPTIONS).toPromise()
      .then(data => {
        if (data.success) {
          this.router.navigate(['/viewPoll/' + data.result.id]);
        }
      })
      .catch(error => {
        if (error.status === 401) {
          this.router.navigate(['/login', {originUrl: '/createPoll'}]);
        }
      });
  }
}



import {Component, OnInit} from '@angular/core';
import {Poll, PollOption} from '../models/poll';
import {GenericResponse} from '../models/rest';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';
import {processPollDescription} from '../util/utils';
import {Group} from '../models/group';

@Component({
  selector: 'app-view-poll',
  templateUrl: './view-poll.component.html',
  styleUrls: ['./view-poll.component.css']
})
export class ViewPollComponent implements OnInit {

  DISPLAY_VOTES_COUNT = 3;

  poll: Poll = new Poll();

  displayVotesCount = [];
  descriptionFullDisplayed = false;

  loggedUserName = '';

  availableUserNamesForAdmin = [];
  availableOptionsForAdmin = [];

  adminChosenUsername = '';
  adminChosenOption = '';

  adminUserNamesToFullNames = new Map();

  adminPanelShown = false;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {

    this.poll.options = [];

    this.http.get<GenericResponse>(SERVER_URL + '/poll/get/' + this.route.snapshot.paramMap.get('pollId'), HTTP_OPTIONS).toPromise()
      .then(data => {
        if (data.result) {
          this.poll = data.result;
          processPollDescription(this.poll);
          this.getUserNamesNotVoted();

          this.poll.options.forEach(_ => {
            this.displayVotesCount.push(this.DISPLAY_VOTES_COUNT);
          });

          this.http.get<GenericResponse>(SERVER_URL + '/user/loggedUserName', HTTP_OPTIONS).toPromise()
            .then(username => {
              if (username.result) {
                this.loggedUserName = username.result;
              }
            });
        } else {
          this.router.navigate(['**']);
        }
      });
  }

  disableTextOverflow(id) {
    const paragraph = document.getElementById(id);
    if (paragraph.classList.contains('text-with-three-dots')) {
      paragraph.classList.remove('text-with-three-dots');
      paragraph.classList.remove('ten-lines-text');
    } else {
      paragraph.classList.add('text-with-three-dots');
      paragraph.classList.add('ten-lines-text');
    }
    this.descriptionFullDisplayed = !this.descriptionFullDisplayed;
  }

  selectOption(pollId) {
    document.getElementById('poll-submit-' + pollId).style.display = 'block';
  }

  vote(pollId) {

    this.http.get<GenericResponse>(SERVER_URL + '/user/loggedUserFullName', HTTP_OPTIONS).toPromise()
      .then(data => {
        if (data.result) {
          const options = document.getElementsByName('poll-' + pollId + '-option');
          let optionId = 0;
          options.forEach(o => {
            // @ts-ignore
            if (o.checked === true) {
              // @ts-ignore
              optionId = o.value;
            }
          });
          const option = this.poll.options.find(o => Number(Number(o.id) === Number(optionId)));

          if (option.haveMeVoted || option.votes > 0 && this.poll.canVoteOnlyOnce) {
            return;
          }

          this.poll.haveMeVoted = true;
          option.haveMeVoted = true;

          option.votes++;
          option.usersVoted.push(data.result);

          this.http.get<GenericResponse>(SERVER_URL + '/poll/vote/' + option.id, HTTP_OPTIONS).subscribe();
        } else {
          this.router.navigate(['/login', {originUrl: '/viewPoll/' + pollId}]);
        }
      });
  }

  voteFor(pollOption, username) {
    const option = this.poll.options.find(o => o.value === pollOption);

    if (option.usersVoted && option.usersVoted.includes(username) || option.votes > 0 && this.poll.canVoteOnlyOnce) {
      return;
    }

    if (username === this.loggedUserName) {
      this.poll.haveMeVoted = true;
      option.haveMeVoted = true;
    }

    option.votes++;
    option.usersVoted.push(username);

    this.http.get<GenericResponse>(SERVER_URL + '/user/fullNameByUserName?username=' + username, HTTP_OPTIONS).toPromise()
      .then(fullName => {
        if (fullName.result) {
          if (!option.fullNamesVoted) {
            option.fullNamesVoted = new Map();
          }
          option.fullNamesVoted[username] = fullName.result;
        }
      });

    this.http.get<GenericResponse>(SERVER_URL + '/poll/voteFor/' + option.id + '?username=' + username, HTTP_OPTIONS).subscribe();

    this.availableUserNamesForAdmin = [];
    this.availableOptionsForAdmin = [];
    this.adminChosenUsername = '';
    this.adminChosenOption = '';
    this.getUserNamesNotVoted();
  }

  calculateOptionPercentage(pollId, optionId) {
    const option = this.poll.options.find(o => o.id === optionId);

    let sum = 0;
    this.poll.options.map(o => o.votes).forEach(v => sum += v);

    return Math.round(Number(option.votes) / sum * 100);
  }

  displayAllVotes(optionIndex) {
    if (this.displayVotesCount[optionIndex] === this.DISPLAY_VOTES_COUNT) {
      this.displayVotesCount[optionIndex] = this.poll.options[optionIndex].usersVoted.length;
    } else {
      this.displayVotesCount[optionIndex] = this.DISPLAY_VOTES_COUNT;
    }
  }

  getUserNamesNotVoted() {
    this.availableUserNamesForAdmin = [];
    this.adminUserNamesToFullNames = new Map();
    const userNamesVoted = [];
    this.poll.options.forEach(option => {
      option.usersVoted.forEach(username => {
        if (!userNamesVoted.includes(username)) {
          userNamesVoted.push(username);
        }
      });
    });
    this.poll.groupNames.forEach(groupName => {
      this.http.get<GenericResponse>(SERVER_URL + '/group/getByTitle/' + groupName, HTTP_OPTIONS).toPromise()
        .then(data => {
          if (data.result) {
            const group: Group = data.result;
            group.memberNames.forEach(username => {
              if (!userNamesVoted.includes(username) && !this.availableUserNamesForAdmin.includes(username)) {
                this.availableUserNamesForAdmin.push(username);
                this.http.get<GenericResponse>(SERVER_URL + '/user/fullNameByUserName?username=' + username, HTTP_OPTIONS).toPromise()
                  .then(fullName => {
                    if (fullName.result) {
                      this.adminUserNamesToFullNames[username] = fullName.result;
                    }
                  });
              }
            });
          }
        });
    });
  }

  setAvailableOptionsForUserName() {
    this.availableOptionsForAdmin = this.poll.options.filter(option => !option.fullNamesVoted[this.adminChosenUsername])
      .map(option => option.value);
  }

  voteAsAdmin() {
    this.voteFor(this.adminChosenOption, this.adminChosenUsername);
  }

  showAdminPanel() {
    this.adminPanelShown = !this.adminPanelShown;
  }
}

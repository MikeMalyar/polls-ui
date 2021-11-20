import {Component, OnInit} from '@angular/core';
import {Group} from '../models/group';
import {Poll, PollOption} from '../models/poll';
import {GenericResponse} from '../models/rest';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.css']
})
export class ViewGroupComponent implements OnInit {

  group: Group = new Group();

  polls: Poll[] = [];

  page = 0;
  count = 5;

  loggedUsername = '';

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {

    this.group.memberNames = [];

    this.http.get<GenericResponse>(SERVER_URL + '/group/get/' + this.route.snapshot.paramMap.get('groupId'), HTTP_OPTIONS).toPromise()
      .then(data => {
        if (data.result) {
          this.group = data.result;
          this.addPollsFromDB();
        } else {
          this.router.navigate(['**']);
        }
      });

    this.http.get<GenericResponse>(SERVER_URL + '/user/loggedUserName', HTTP_OPTIONS).toPromise()
      .then(data => {
        if (data.result) {
          this.loggedUsername = data.result;
        }
      });
  }

  addPollsFromDB() {
    const getPollsUrl = SERVER_URL + '/poll/getPollsAvailableForGroup/' + this.group.id + '/' + this.page + '/' + this.count;
    const length = this.polls.length;
    this.http.get<GenericResponse>(getPollsUrl, HTTP_OPTIONS).toPromise()
      .then(data => {
        this.polls = this.polls.concat(data.result);
        if (length === this.polls.length) {
          document.getElementById('loadMoreBtn').style.display = 'none';
        }
      });
  }

  loadMorePolls() {
    this.page++;

    this.addPollsFromDB();
  }

  disableTextOverflow(id) {
    const paragraph = document.getElementById(id);
    if (paragraph.classList.contains('text-with-three-dots')) {
      paragraph.classList.remove('text-with-three-dots');
      paragraph.classList.remove('three-lines-text');
    } else {
      paragraph.classList.add('text-with-three-dots');
      paragraph.classList.add('three-lines-text');
    }
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
          const poll = this.polls.find(p => p.id === pollId);
          const option = poll.options.find(o => Number(Number(o.id) === Number(optionId)));

          if (option.haveMeVoted || option.votes > 0 && poll.canVoteOnlyOnce) {
            return;
          }

          poll.haveMeVoted = true;
          option.haveMeVoted = true;

          option.votes++;
          option.usersVoted.push(data.result);

          this.http.get<GenericResponse>(SERVER_URL + '/poll/vote/' + option.id, HTTP_OPTIONS).subscribe();
        } else {
          this.router.navigate(['/login', {originUrl: '/viewPoll/' + pollId}]);
        }
      });
  }

  calculateOptionPercentage(pollId, optionId) {
    const options = this.polls.find(p => p.id === pollId).options;
    const option = options.find(o => o.id === optionId);

    let sum = 0;
    options.map(o => o.votes).forEach(v => sum += v);

    return Math.round(Number(option.votes) / sum * 100);
  }
}

import {Component, OnInit} from '@angular/core';
import {Poll, PollOption} from '../models/poll';
import {GenericResponse} from '../models/rest';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';
import {HttpClient} from '@angular/common/http';
import {ActivatedRoute, Router} from '@angular/router';

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

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {
  }

  ngOnInit() {

    this.poll.options = [];

    this.http.get<GenericResponse>(SERVER_URL + '/poll/get/' + this.route.snapshot.paramMap.get('pollId'), HTTP_OPTIONS).toPromise()
      .then(data => {
        if (data.result) {
          this.poll = data.result;

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
}

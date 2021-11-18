import {Component, OnInit} from '@angular/core';
import {MyGroupDto, MyPollDto} from '../models/dto';
import {Poll, PollOption} from '../models/poll';
import {HttpClient} from '@angular/common/http';
import {GenericResponse} from '../models/rest';
import {HTTP_OPTIONS, SERVER_URL} from '../config/http-config';
import {Router} from '@angular/router';

@Component({
  selector: 'app-main-page',
  templateUrl: './main-page.component.html',
  styleUrls: ['./main-page.component.css']
})
export class MainPageComponent implements OnInit {

  userName: string;
  myPolls: MyPollDto[] = [];
  myGroups: MyGroupDto[] = [];

  polls: Poll[] = [];

  constructor(private http: HttpClient, private router: Router) {
  }

  ngOnInit() {
    this.http.get<GenericResponse>(SERVER_URL + '/user/loggedUserFullName', HTTP_OPTIONS).toPromise()
      .then(data => this.userName = data.result);

    this.myPolls.push(new MyPollDto(1, 'Тестове опитування 1', 3),
      new MyPollDto(2, 'Тестове опитування номер 2', 20));   // take from DB

    this.myGroups.push(new MyGroupDto(1, '602', 10),
      new MyGroupDto(2, '607', 4));   // take from DB

    const poll1 = new Poll();
    // @ts-ignore
    poll1.id = 1;
    poll1.title = 'Тестове опитування 1';
    poll1.description = 'Опис цього опитування призначений для перевірки його відображення у веб браузері.'.repeat(3);
    poll1.options = [new PollOption(1, 'Опція 1', 8, false), new PollOption(2, 'Опція 2', 5, false)];
    poll1.requiredForFilling = true;
    this.polls.push(poll1);

    const poll2 = new Poll();
    // @ts-ignore
    poll2.id = 2;
    poll2.title = 'Тестове опитування 2';
    poll2.description = 'Опис цього тестового опитування №2 призначений для перевірки його відображення у веб браузері.'.repeat(3);
    poll2.options = [new PollOption(3, 'Тестова опція 1', 2, false), new PollOption(4, 'Тестова опція 2', 32, false)];
    this.polls.push(poll2);
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

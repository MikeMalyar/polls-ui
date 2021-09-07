import { Component, OnInit } from '@angular/core';
import {Group} from '../models/group';
import {Poll, PollOption} from '../models/poll';

@Component({
  selector: 'app-view-group',
  templateUrl: './view-group.component.html',
  styleUrls: ['./view-group.component.css']
})
export class ViewGroupComponent implements OnInit {

  group: Group;

  polls: Poll[] = [];

  constructor() { }

  ngOnInit() {

    this.group = new Group();   // take from DB
    this.group.id = 1;
    this.group.title = '607';
    this.group.description = 'Тестова группа №607. Опис призначений для перевірки його відображення у веб браузері.'.repeat(3);
    this.group.memberNames = ['Mykhailo Maliarchuk', 'Oleksandr Chornous', 'Andriy Buchynskiy'];

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
  }

  calculateOptionPercentage(pollId, optionId) {
    const options = this.polls.find(p => p.id === pollId).options;
    const option = options.find(o => o.id === optionId);

    let sum = 0;
    options.map(o => o.votes).forEach(v => sum += v);

    return Math.round(Number(option.votes) / sum * 100);
  }
}

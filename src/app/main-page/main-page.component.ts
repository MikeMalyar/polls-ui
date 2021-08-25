import {Component, OnInit} from '@angular/core';
import {MyGroupDto, MyPollDto} from '../models/dto';
import {Poll, PollOption} from '../models/poll';

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

  constructor() {
  }

  ngOnInit() {
    this.userName = 'Mykhailo Maliarchuk'; // take from DB

    this.myPolls.push(new MyPollDto(1, 'Тестове опитування 1', 3),
      new MyPollDto(2, 'Тестове опитування номер 2', 20));   // take from DB

    this.myGroups.push(new MyGroupDto(1, '602', 10),
      new MyGroupDto(2, '607', 4));   // take from DB

    const poll1 = new Poll();
    // @ts-ignore
    poll1.id = 1;
    poll1.title = 'Тестове опитування 1';
    poll1.description = 'Опис цього опитування призначений для перевірки його відображення у веб браузері.'.repeat(3);
    poll1.options = [new PollOption(1, 'Опція 1'), new PollOption(2, 'Опція 2')];
    poll1.requiredForFilling = true;
    this.polls.push(poll1);

    const poll2 = new Poll();
    // @ts-ignore
    poll2.id = 2;
    poll2.title = 'Тестове опитування 2';
    poll2.description = 'Опис цього тестового опитування №2 призначений для перевірки його відображення у веб браузері.'.repeat(3);
    poll2.options = [new PollOption(3, 'Тестова опція 1'), new PollOption(4, 'Тестова опція 2')];
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
}

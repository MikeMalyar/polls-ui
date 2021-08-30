import {Component, OnInit} from '@angular/core';
import {Poll, PollOption} from '../models/poll';

@Component({
  selector: 'app-view-poll',
  templateUrl: './view-poll.component.html',
  styleUrls: ['./view-poll.component.css']
})
export class ViewPollComponent implements OnInit {

  DISPLAY_VOTES_COUNT = 3;

  poll: Poll;

  displayVotesCount = [];
  descriptionFullDisplayed = false;

  constructor() {
  }

  ngOnInit() {

    this.poll = new Poll(); // take from DB
    this.poll.id = 1;
    this.poll.title = 'Тестове опитування 1';
    this.poll.description = 'Опис цього опитування призначений для перевірки його відображення у веб браузері.'.repeat(15);
    this.poll.options = [new PollOption(1, 'Опція 1', 8, false),
      new PollOption(2, 'Опція 2', 5, false),
      new PollOption(3, 'Опція 3', 7, false)];
    this.poll.requiredForFilling = true;
    this.poll.anonymousForReacted = true;

    this.poll.options.forEach(_ => {
      this.displayVotesCount.push(this.DISPLAY_VOTES_COUNT);
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

    this.poll.haveMeVoted = true;
    option.haveMeVoted = true;

    option.votes++;

    this.addAnonymousInformation();
  }

  calculateOptionPercentage(pollId, optionId) {
    const option = this.poll.options.find(o => o.id === optionId);

    let sum = 0;
    this.poll.options.map(o => o.votes).forEach(v => sum += v);

    return Math.round(Number(option.votes) / sum * 100);
  }

  addAnonymousInformation() {
    this.poll.options.forEach(option => {
      option.usersVoted = ['Mykhailo Maliarchuk', 'Test User 1', 'Test User 2', 'Test User 3', 'Test User 4'];  // take from DB
    });
  }

  displayAllVotes(optionIndex) {
    if (this.displayVotesCount[optionIndex] === this.DISPLAY_VOTES_COUNT) {
      this.displayVotesCount[optionIndex] = this.poll.options[optionIndex].usersVoted.length;
    } else {
      this.displayVotesCount[optionIndex] = this.DISPLAY_VOTES_COUNT;
    }
  }
}

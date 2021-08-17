import {Component, OnInit} from '@angular/core';
import {Poll, PollOption} from '../models/poll';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent implements OnInit {

  poll: Poll = new Poll();

  pollOptionsCount: number;

  constructor() {
  }

  ngOnInit() {
    this.poll.options = [];
    this.poll.options.push(new PollOption(null, 'Опція 1'), new PollOption(null, 'Опція 2'));

    this.pollOptionsCount = this.poll.options.length;
  }

  addPollOption() {
    this.poll.options.push(new PollOption(null, 'Опція ' + ++this.pollOptionsCount));
  }

  removePollOption(i) {
    if (i !== 0 && i !== 1) {
      this.poll.options.splice(i, 1);
    }
  }

  filterAccessDropdown() {

  }
}



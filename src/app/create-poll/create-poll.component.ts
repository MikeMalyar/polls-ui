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

  groupNames: string[];
  chosenGroupNames: string[];

  groupNameInputValue = '';

  constructor() {
  }

  ngOnInit() {
    this.poll.options = [];
    this.poll.options.push(new PollOption(null, 'Опція 1'), new PollOption(null, 'Опція 2'));

    this.pollOptionsCount = this.poll.options.length;

    this.groupNames = ['group 1', 'group 2', 'group 3', 'group 4', 'group 5']; // take from DB
    this.groupNames.sort();
    this.chosenGroupNames = [];
  }

  addPollOption() {
    this.poll.options.push(new PollOption(null, 'Опція ' + ++this.pollOptionsCount));
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
  }
}



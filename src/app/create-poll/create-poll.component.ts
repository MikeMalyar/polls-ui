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

  currentDate = new Date();
  currentDateString = '';

  constructor() {
  }

  ngOnInit() {
    this.poll.options = [];
    this.poll.options.push(new PollOption(null, 'Опція 1', 0), new PollOption(null, 'Опція 2', 0));

    this.pollOptionsCount = this.poll.options.length;

    this.groupNames = ['group 1', 'group 2', 'group 3', 'group 4', 'group 5']; // take from DB
    this.groupNames.sort();
    this.chosenGroupNames = [];

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
    this.poll.options.push(new PollOption(null, 'Опція ' + ++this.pollOptionsCount, 0, false));
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
}



import {Component, OnInit} from '@angular/core';
import {Group} from '../models/group';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  group: Group;

  username: string;
  availableUserNames: string[] = [];

  memberNameInputValue: string;

  constructor() {
  }

  ngOnInit() {

    this.group = new Group();
    this.group.memberNames = [];

    this.username = 'Mykhailo Maliarchuk';
    this.availableUserNames.push('Test User 1', 'Test User 2', 'Test User 3');

    if (!this.group.memberNames.includes(this.username)) {
      this.group.memberNames.push(this.username);
    }
  }

  addMemberNameOption() {
    const memberNameInputValue = this.memberNameInputValue;
    document.getElementById('availableUserNamesList').childNodes.forEach(child => {
      // @ts-ignore
      if (child.innerText === memberNameInputValue) {
        this.group.memberNames.push(memberNameInputValue);
        this.availableUserNames.splice(this.availableUserNames.indexOf(memberNameInputValue), 1);

        this.memberNameInputValue = '';
      }
    });
  }

  removeMemberNameOption(i) {
    const memberName = this.group.memberNames[i];
    if (memberName !== this.username) {
      this.group.memberNames.splice(i, 1);
      this.availableUserNames.push(memberName);
      this.availableUserNames.sort();
    }
  }
}

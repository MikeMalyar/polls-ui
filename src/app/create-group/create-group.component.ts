import {Component, OnInit} from '@angular/core';
import {Group} from '../models/group';

@Component({
  selector: 'app-create-group',
  templateUrl: './create-group.component.html',
  styleUrls: ['./create-group.component.css']
})
export class CreateGroupComponent implements OnInit {

  group: Group;

  constructor() {
  }

  ngOnInit() {

    this.group = new Group();
  }

}

import {Component, OnInit} from '@angular/core';
import {Poll} from '../models/poll';

@Component({
  selector: 'app-create-poll',
  templateUrl: './create-poll.component.html',
  styleUrls: ['./create-poll.component.css']
})
export class CreatePollComponent implements OnInit {

  poll: Poll = new Poll();

  constructor() {
  }

  ngOnInit() {
  }

}



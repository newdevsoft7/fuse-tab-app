import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-users-profile-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class UsersProfileActivityComponent implements OnInit {

  @Input() user: any;
  isContentShow = false;

  constructor() { }

  ngOnInit() {
  }

  show() {
    this.isContentShow = true;
  }

  hide() {
    this.isContentShow = false;
  }

}

import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-group-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class GroupActivityComponent implements OnInit {

  @Input() group;
  isContentShow = false;

  constructor() { }

  ngOnInit() {
  }

  show() {
    this.isContentShow = true;
  }

}

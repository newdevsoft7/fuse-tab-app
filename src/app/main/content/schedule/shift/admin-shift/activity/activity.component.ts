import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-admin-shift-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.scss']
})
export class AdminShiftActivityComponent implements OnInit {

  @Input() shift: any;
  isContentShow = false;

  constructor() { }

  ngOnInit() {
  }

  show() {
    this.isContentShow = true;
  }

}

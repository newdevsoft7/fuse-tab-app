import { Component, OnInit, Input, ElementRef, HostBinding } from '@angular/core';

@Component({
  selector: 'app-tab',
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.scss']
})
export class TabComponent {
  _title: string;

  @Input('tabTitle')
  get title() {
    return this._title;
  };
  set title(value) {
    this._title = value;
  }
  @Input() active = false;
  @Input() template;
  @Input() data;
  @Input() url;
  @Input() multiple;
  dropzone: string;
  hover = false;

  @HostBinding('class') get classes() {
    return this.url? this.url.replace('/', '-') : '';
  }

  constructor(public element: ElementRef) { }

}

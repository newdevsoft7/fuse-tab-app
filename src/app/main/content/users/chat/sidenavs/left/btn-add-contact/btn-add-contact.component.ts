import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector   : 'btn-add-contact',
    templateUrl: './btn-add-contact.component.html',
    styleUrls  : ['./btn-add-contact.component.scss']
})
export class BtnAddContactComponent
{
  isAdded: boolean = false;
  @Input('added') set added(value: boolean) {
    this.loaded = true;
    this.isAdded = value;
  };
  @Output() onTapped: EventEmitter<any> = new EventEmitter();

  loaded: boolean = true;

  constructor()
  {
  }

  trigger(): void {
    this.loaded = false;
    this.onTapped.next();
  }
}

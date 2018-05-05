import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'app-tracking-option-access',
  templateUrl: './option-access.component.html',
  styleUrls: ['./option-access.component.scss']
})
export class TrackingOptionAccessComponent {
  @Input() lvl: string;
  @Input() data: any;
  @Input() source: any;
  
  @Output() filterUser: EventEmitter<{query: string, lvl: string}> = new EventEmitter();
  @Output() addUser: EventEmitter<any> = new EventEmitter();
  @Output() removeUser: EventEmitter<any> = new EventEmitter();

  selectedUser: any;

  constructor() {}

  selectUser(event: any) {
    this.selectedUser = event.option.value;
  }

  userDisplayFn(user?: any): string {
    return user? user.name : '';
  }
}

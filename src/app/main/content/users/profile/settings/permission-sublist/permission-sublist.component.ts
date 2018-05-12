import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'app-users-profile-settings-permission-sublist',
  templateUrl: './permission-sublist.component.html',
  styleUrls: ['./permission-sublist.component.scss']
})
export class UsersSettingsPermissionSublistComponent {
  @Input() type: string;
  @Input() data: any;
  @Input() source: any;
  @Input() displayField: string;

  @Output() filterSource: EventEmitter<{ query: string, type: string }> = new EventEmitter();
  @Output() addItem: EventEmitter<any> = new EventEmitter();
  @Output() removeItem: EventEmitter<any> = new EventEmitter();

  selectedItem: any;

  constructor() { }

  selectItem(event: any) {
    this.selectedItem = event.option.value;
  }

  itemDisplayFn(item?: any): string {
    return item ? item[this.displayField] : '';
  }
}

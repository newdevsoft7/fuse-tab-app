import { Component, Input, Output, EventEmitter } from "@angular/core";
import { MatSlideToggleChange } from "@angular/material";

@Component({
    selector: 'app-users-settings-link-other-accounts',
    templateUrl: './link-other-accounts.component.html',
    styleUrls: ['./link-other-accounts.component.scss']
})
export class UsersSettingsLinkOtherAccountsComponent {
    @Input() user: any;
    @Input() links: any;
    @Output() toggleLinked: EventEmitter<boolean> = new EventEmitter();
    @Output() approveCompany: EventEmitter<number> = new EventEmitter();

    changeLinkedStatus(event: MatSlideToggleChange) {
        this.toggleLinked.next(event.checked);
    }
}

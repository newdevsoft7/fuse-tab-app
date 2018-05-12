import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-users-settings-client-permissions',
    templateUrl: './client-permissions.component.html',
    styleUrls: ['./client-permissions.component.scss']
})
export class UsersSettingsClientPermissionsComponent implements OnInit {

    @Input() userPermissions;
    @Input() trackingOptions;
    @Input() trackingOptionSource;

    @Output() optionChanged = new EventEmitter();
    @Output() filterSource: EventEmitter<any> = new EventEmitter();
    @Output() addItem: EventEmitter<any> = new EventEmitter();
    @Output() removeItem: EventEmitter<any> = new EventEmitter();

    constructor(
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

    toggleOption(option, event) {
        this.userPermissions[option].set=event.checked;
        this.optionChanged.emit({ pname: option, set: event.checked ? 1 : 0 });
    }
}

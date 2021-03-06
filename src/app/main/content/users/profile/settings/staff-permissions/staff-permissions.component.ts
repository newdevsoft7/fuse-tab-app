import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-users-settings-staff-permissions',
    templateUrl: './staff-permissions.component.html',
    styleUrls: ['./staff-permissions.component.scss']
})
export class UsersSettingsStaffPermissionsComponent implements OnInit {

    @Input() userPermissions;

    @Output() optionChanged = new EventEmitter();

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
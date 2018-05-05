import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-users-settings-staff-permissions',
    templateUrl: './staff-permissions.component.html',
    styleUrls: ['./staff-permissions.component.scss']
})
export class UsersSettingsStaffPermissionsComponent implements OnInit {

    @Input() userPermissions;

    constructor() { }

    ngOnInit() {
    }

}

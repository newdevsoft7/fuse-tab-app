import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-users-settings-admin-permissions',
    templateUrl: './admin-permissions.component.html',
    styleUrls: ['./admin-permissions.component.scss']
})
export class UsersSettingsAdminPermissionsComponent implements OnInit {

    @Input() userPermissions;

    constructor() { }

    ngOnInit() {
    }

}

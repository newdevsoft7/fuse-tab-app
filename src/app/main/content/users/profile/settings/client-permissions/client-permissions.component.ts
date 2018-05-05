import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-users-settings-client-permissions',
    templateUrl: './client-permissions.component.html',
    styleUrls: ['./client-permissions.component.scss']
})
export class UsersSettingsClientPermissionsComponent implements OnInit {

    @Input() userPermissions;

    constructor() { }

    ngOnInit() {
    }

}

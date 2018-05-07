import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-users-settings-admin-options',
    templateUrl: './admin-options.component.html',
    styleUrls: ['./admin-options.component.scss']
})
export class UsersSettingsAdminOptionsComponent implements OnInit {
    @Input() userOptions;

    @Output() optionChanged = new EventEmitter();

    constructor(
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

    toggleOption(option, event) {
        console.log(this.userOptions);
        this.userOptions[option].set=event.checked;
        this.optionChanged.emit({ oname: option, set: event.checked ? 1 : 0 });
    }
}
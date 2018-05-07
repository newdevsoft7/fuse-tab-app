import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-users-settings-staff-options',
    templateUrl: './staff-options.component.html',
    styleUrls: ['./staff-options.component.scss']
})
export class UsersSettingsStaffOptionsComponent implements OnInit {

    @Input() userOptions;
    
    @Output() optionChanged = new EventEmitter();

    constructor(
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

    toggleOption(option, event) {
        this.userOptions[option].set=event.checked;
        this.optionChanged.emit({ oname: option, set: event.checked ? 1 : 0 });
    }
}
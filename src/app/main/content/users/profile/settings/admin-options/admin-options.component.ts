import {
    Component, OnInit, Input,
    ViewEncapsulation, SimpleChanges,
    OnChanges, Output, EventEmitter,
    ViewChild, OnDestroy
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
    selector: 'app-users-settings-admin-options',
    templateUrl: './admin-options.component.html',
    styleUrls: ['./admin-options.component.scss']
})
export class UsersSettingsAdminOptionsComponent implements OnInit {
    device : any;
    @Input() userOptions;

    @Output() optionChanged = new EventEmitter();

    constructor(
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

    toggleOption(option) {
        alert("shit");
        console.log(option);
        console.log(this.device);
        this.optionChanged.emit(option);
    }
}

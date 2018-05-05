import {
    Component, OnInit, Input,
    ViewEncapsulation, SimpleChanges,
    OnChanges, Output, EventEmitter,
    ViewChild, OnDestroy
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
    selector: 'app-users-settings-staff-options',
    templateUrl: './staff-options.component.html',
    styleUrls: ['./staff-options.component.scss']
})
export class UsersSettingsStaffOptionsComponent implements OnInit {

    @Input() userOptions;
    
    constructor(
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

}

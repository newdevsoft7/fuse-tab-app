import {
    Component, OnInit, Input,
    ViewEncapsulation, SimpleChanges,
    OnChanges, Output, EventEmitter,
    ViewChild, OnDestroy
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
    selector: 'app-users-settings-admin',
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class UsersSettingsAdminComponent implements OnInit {

    constructor(
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

}

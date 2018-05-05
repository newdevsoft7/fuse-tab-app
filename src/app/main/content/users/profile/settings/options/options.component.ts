import {
    Component, OnInit, Input,
    ViewEncapsulation, SimpleChanges,
    OnChanges, Output, EventEmitter,
    ViewChild, OnDestroy
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
    selector: 'app-users-settings-options',
    templateUrl: './options.component.html',
    styleUrls: ['./options.component.scss']
})
export class UsersSettingsOptionsComponent implements OnInit {

    constructor(
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

}

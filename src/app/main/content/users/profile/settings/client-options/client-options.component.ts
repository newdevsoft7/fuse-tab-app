import {
    Component, OnInit, Input,
    ViewEncapsulation, SimpleChanges,
    OnChanges, Output, EventEmitter,
    ViewChild, OnDestroy
} from '@angular/core';

import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

@Component({
    selector: 'app-users-settings-client-options',
    templateUrl: './client-options.component.html',
    styleUrls: ['./client-options.component.scss']
})
export class UsersSettingsClientOptionsComponent implements OnInit {

    @Input() userOptions;
    
    constructor(
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

}

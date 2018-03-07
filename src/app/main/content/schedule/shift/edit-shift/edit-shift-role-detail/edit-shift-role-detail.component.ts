import {
    Component, OnInit, Input, ViewEncapsulation
} from '@angular/core';

@Component({
    selector: 'app-edit-shift-role-detail',
    templateUrl: './edit-shift-role-detail.component.html',
    styleUrls: ['./edit-shift-role-detail.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class EditShiftRoleDetailComponent implements OnInit {

    @Input() shifts;

    constructor() { }

    ngOnInit() {
    }

}

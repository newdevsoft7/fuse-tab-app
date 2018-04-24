import {
    Component, OnInit, ViewEncapsulation,
    Input, Output, EventEmitter,
    ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

import * as _ from 'lodash';
import * as moment from 'moment';

@Component({
    selector: 'app-admin-shift-edit-break',
    templateUrl: './edit-break.component.html',
    styleUrls: ['./edit-break.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftEditBreakComponent implements OnInit {

    formActive = false;
    form: FormGroup;
    @ViewChild('breakInput') breakInputField;

    @Input() editable;

    @Input() staff;
    @Output() onBreakChanged = new EventEmitter;

    constructor(
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        
    }

    focusBreakField() {
        setTimeout(() => {
            this.breakInputField.nativeElement.focus();
        });
    }

    get break() {
        return !this.staff.unpaid_break ? 0 : this.staff.unpaid_break;
    }

    openForm() {
        this.form = this.formBuilder.group({
            break: [this.staff.unpaid_break, Validators.required]
        });
        this.formActive = true;
        this.focusBreakField();
    }

    saveForm() {
        if (this.form.valid) {
            const nbreak = this.form.getRawValue().break;
            if (nbreak !== this.staff.unpaid_break) {
                this.onBreakChanged.next(nbreak);
            }
            this.formActive = false;
        }
    }

    closeForm() {
        this.formActive = false;
    }

}

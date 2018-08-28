import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ScheduleService } from '../../../schedule.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-admin-shift-edit-client',
    templateUrl: './edit-client.component.html',
    styleUrls: ['./edit-client.component.scss']
})
export class AdminShiftEditClientComponent implements OnInit {

    form: FormGroup;
    formActive = false;

    @Input() shift;
    @Input() clients: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private scheduleService: ScheduleService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            client_id: [+this.shift.client_id, Validators.required]
        });
        this.formActive = true;
    }

    saveForm() {
        if (this.form.valid) {
            const client_id = this.form.getRawValue().client_id;
            if (client_id !== +this.shift.client_id) {
                this.scheduleService.updateShift(this.shift.id, { client_id })
                    .subscribe(res => {
                        //this.toastr.success(res.message);
                        this.shift.client_id = `${client_id}`;
                    });
            }
            this.formActive = false;
        }
    }

    closeForm() {
        this.formActive = false;
    }

    display() {
        if (!this.shift.client_id) { return 'No Client'; }
        const index = this.clients.findIndex(v => v.id === +this.shift.client_id);
        const result = index > -1 ? this.clients[index].cname : 'No Client';
        return result;
    }
}

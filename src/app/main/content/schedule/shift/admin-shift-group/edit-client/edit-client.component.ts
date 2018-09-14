import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ScheduleService } from '../../../schedule.service';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';

@Component({
    selector: 'app-group-edit-client',
    templateUrl: './edit-client.component.html',
    styleUrls: ['./edit-client.component.scss']
})
export class GroupEditClientComponent implements OnInit {

    form: FormGroup;
    formActive = false;

    @Input() group;
    @Input() clients: any[] = [];

    constructor(
        private formBuilder: FormBuilder,
        private scheduleService: ScheduleService,
        private scMessageService: SCMessageService
    ) { }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            client_id: [this.group.client_id, Validators.required]
        });
        this.formActive = true;
    }

    async saveForm() {
        if (this.form.valid) {
            const client_id = this.form.getRawValue().client_id;
            if (client_id !== this.group.client_id) {
                try {
                    //this.toastr.success(res.message);
                    this.group.client_id = client_id;
                } catch (e) {
                    this.scMessageService.error(e);
                }
            }
            this.formActive = false;
        }
    }

    closeForm() {
        this.formActive = false;
    }

    display() {
        if (!this.group.client_id) { return 'No Client'; }
        const index = this.clients.findIndex(v => v.id === this.group.client_id);
        const result = index > -1 ? this.clients[index].cname : 'No Client';
        return result;
    }

}

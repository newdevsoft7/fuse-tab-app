import { Component, OnInit, Input } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { UserService } from '../../user.service';

@Component({
    selector: 'app-edit-user-status',
    templateUrl: './edit-user-status.component.html',
    styleUrls: ['./edit-user-status.component.scss']
})
export class EditUserStatusComponent implements OnInit {

    userStatuses: any[];
    formActive = false;
    form: FormGroup;

    @Input() user: any;

    constructor(
        private tokenStorage: TokenStorage,
        private userService: UserService,
        private formBuilder: FormBuilder,
        private toastr: ToastrService
    ) {
        this.userStatuses = this.tokenStorage.getSettings().user_statuses || [];
    }

    ngOnInit() {
    }

    openForm() {
        this.form = this.formBuilder.group({
            user_status_id: [this.user.user_status ? this.user.user_status.id : null]
        });
        this.formActive = true;
    }

    async saveForm() {
        const user_status_id = this.form.getRawValue().user_status_id;
        try {
            const res = await this.userService.updateUser(this.user.id, { user_status_id });
            //this.toastr.success(res.message);
            this.user.user_status = this.userStatuses.find(v => v.id === user_status_id);
        } catch (e) {
            this.toastr.error(e.error.error);
        }
        this.formActive = false;
    }

    closeForm() {
        this.formActive = false;
    }

}

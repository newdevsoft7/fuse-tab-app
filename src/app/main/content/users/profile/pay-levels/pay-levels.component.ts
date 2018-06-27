import { Component, OnInit, Input, ViewChildren, QueryList, AfterViewChecked } from '@angular/core';
import { UserService } from '../../user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-users-profile-pay-levels',
    templateUrl: './pay-levels.component.html',
    styleUrls: ['./pay-levels.component.scss']
})
export class UsersProfilePayLevelsComponent implements OnInit, AfterViewChecked {

    @Input('userInfo') user;
    @ViewChildren('tag') tags: QueryList<any>;
    prevOpenedField: any;

    payLevels: any[];
    
    constructor(
        private userService: UserService,
        private toastr: ToastrService
    ) { }

    ngOnInit() {
        this.getPayLevels();
    }

    ngAfterViewChecked() {
        const openedFields = this.tags.filter(v => v.formActive);
        switch (openedFields.length) {
            case 0:
                break;
            case 1:
                setTimeout(() => this.prevOpenedField = openedFields[0]);
                break;
            case 2:
                setTimeout(() => this.prevOpenedField.closeForm());
                break;
        }
    }

    async getPayLevels() {
        try {
            this.payLevels = await this.userService.getUserPayLevels(this.user.id);
        } catch (e) {
            this.displayError(e);
        }
    }

    private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.error.message);
        }
    }
}

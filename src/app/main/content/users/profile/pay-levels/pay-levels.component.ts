import { Component, OnInit, Input, ViewChildren, QueryList, AfterViewChecked } from '@angular/core';
import { UserService } from '../../user.service';
import { SCMessageService } from '../../../../../shared/services/sc-message.service';

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
        private scMessageService: SCMessageService
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
            this.scMessageService.error(e);
        }
    }

}

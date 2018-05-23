import { Component, OnInit, ViewEncapsulation, Inject, Input } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent} from '@angular/material';
import { ScheduleService } from '../../../schedule.service';
import { MessageService } from '../../../../users/message';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';
import { TabService } from '../../../../../tab/tab.service';
import { Tab } from '../../../../../tab/tab';
import { TAB } from '../../../../../../constants/tab';

@Component({
    selector: 'app-admin-shift-list-email-dialog',
    templateUrl: './email-dialog.component.html',
    styleUrls: ['./email-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ShiftListEmailDialogComponent implements OnInit {
    
    roles: any[] = [];
    templates: any[] = [];
    selectedTemplate: any;

    types: any[] = [
        { value: 'applicants', label: 'Applicants' },
        { value: 'invited', label: 'Invited' },
        { value: 'not_available', label: 'Not Available' },
        { value: 'rejected', label: 'Rejected' },
        { value: 'selected', label: 'Selected' },
        { value: 'standby', label: 'Standby' },
    ];
    selectedType: string;

    constructor(
        private scheduleService: ScheduleService,
        private messageService: MessageService,
        private toastr: ToastrService,
        private tabService: TabService,
        public dialogRef: MatDialogRef<ShiftListEmailDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any
    ) { 
        this.selectedType = data.type ? data.type : 'selected';
    }

    async ngOnInit() {
        try {
            this.roles = await this.scheduleService.getRolesForShiftMessage(this.data.shiftIds);
        } catch (e) {
            this.handleError(e);
        }
    }

    async filterTemplates(searchText: string): Promise<any> {
        if (!searchText) {
          this.templates = [];
          return;
        }
        try {
          this.templates = await this.messageService.searchTemplates(searchText);
        } catch (e) {
          this.handleError(e.error);
        }
      }

    templateDisplayFn(template?: any): string {
        return template? template.tname : '';
    }
    
    async selectTemplate(event: MatAutocompleteSelectedEvent): Promise<any> {
        try {
            this.selectedTemplate = event.option.value;
        } catch (e) {
            this.handleError(e.error);
        }
    }

    selectAll() {
        this.roles.forEach(shift => {
            shift.shift_roles.forEach(role => role.checked = true);
        });
    }

    toggleSelection() {
        this.roles.forEach(shift => {
            shift.shift_roles.forEach(role => role.checked = role.checked ? false : true);
        });
    }

    get isEnabled() {
        return this.roles.some(shift => shift.shift_roles.some(role => role.checked));
    }

    getLabel(val: string) {
        return this.types.find(v => v.value === val).label;
    }

    async message() {
        const roleIds = _.flattenDeep(this.roles.map(v => v.shift_roles.filter(r => r.checked).map(r => r.id)));
        try {
            const users = await this.scheduleService.getUsersToMessage(this.selectedType, roleIds);
            const tab = _.cloneDeep(TAB.USERS_NEW_MESSAGE_TAB);
            this.dialogRef.close();
            tab.data.recipients = users;
            tab.data.template = this.selectedTemplate;
            this.tabService.openTab(tab);
        } catch (e) {
            this.handleError(e);
        }
    }

    private handleError(e): void {
        this.toastr.error(e.message || 'Something is wrong');
    }
}

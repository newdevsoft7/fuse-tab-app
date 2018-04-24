import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { ScheduleService } from '../../../schedule.service';
import { GroupEditWorkareasDialogComponent } from './edit-workareas-dialog/edit-workareas-dialog.component';

@Component({
    selector: 'app-group-edit-workareas',
    templateUrl: './edit-workareas.component.html',
    styleUrls: ['./edit-workareas.component.scss']
})
export class GroupEditWorkareasComponent implements OnInit, OnChanges {

    @Input() group;
    @Input() data;

    options;
    workareas = [];

    dialogRef: MatDialogRef<GroupEditWorkareasDialogComponent>;

    constructor(
        private dialog: MatDialog,
        private scheduleService: ScheduleService
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.group && changes.group.currentValue) {
            this.workareas = this.group.work_areas;
        }

        if (changes.data && changes.data.currentValue) {
            this.options = this.data.work_areas;
        }
    }

    openDialog() {
        this.dialogRef = this.dialog.open(GroupEditWorkareasDialogComponent, {
            data: {
                workareas: this.workareas,
                options: this.options
            },
            panelClass: 'group-edit-workareas-dialog'
        });

        this.dialogRef.afterClosed().subscribe(async (options) => {
            if (options !== false) {
                try {
                    const res = await this.scheduleService.setGroupWorkareas(this.group.id, options);
                    this.workareas = options.map(option => this.options.find(o => o.id === option));
                } catch (e) {

                }
            }
        });
    }

}

import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { EditWorkareasDialogComponent } from './edit-workareas-dialog/edit-workareas-dialog.component';
import { ScheduleService } from '../../../schedule.service';

@Component({
    selector: 'app-edit-workareas',
    templateUrl: './edit-workareas.component.html',
    styleUrls: ['./edit-workareas.component.scss']
})
export class EditWorkareasComponent implements OnInit, OnChanges {

    @Input() shift;
    @Input() data;

    options;
    workareas = [];

    dialogRef: MatDialogRef<EditWorkareasDialogComponent>;

    constructor(
        private dialog: MatDialog,
        private scheduleService: ScheduleService
    ) { }

    ngOnInit() {
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.shift && changes.shift.currentValue) {
            this.workareas = this.shift.work_areas;
        }

        if (changes.data && changes.data.currentValue) {
            this.options = this.data.work_areas;
        }
    }

    openDialog() {
        this.dialogRef = this.dialog.open(EditWorkareasDialogComponent, {
            data: {
                workareas: this.workareas,
                options: this.options
            },
            panelClass: 'edit-workareas-dialog'
        });

        this.dialogRef.afterClosed().subscribe(async (options) => {
            if (options !== false) {
                try {
                    const res = await this.scheduleService.setShiftWorkareas(this.shift.id, options);
                    this.workareas = options.map(option => this.options.find(o => o.id === option));
                } catch (e) {

                }
            }
        });
    }

}

import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../schedule.service';
import { CustomLoadingService } from '../../../../shared/services/custom-loading.service';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-column-mapping',
    templateUrl: './column-mapping.component.html',
    styleUrls: ['./column-mapping.component.scss']
})
export class ColumnMappingComponent implements OnInit {

    map: any = {};
    groups: any[] = [];

    constructor(
        private spinner: CustomLoadingService,
        private toastr: ToastrService,
        private scheduleService: ScheduleService
    ) { }

    async ngOnInit() {
        try {
            this.spinner.show();
            this.map = await this.scheduleService.getColumnMaps();
            this.groups = Object.keys(this.map);
            this.spinner.hide();
        } catch (e) {
            this.spinner.hide();
            this.displayError(e);
        }
    }

    async saveColumnMap(value, item) {
        try {
            const res = await this.scheduleService.saveColumnMap(item.id, value);
            this.toastr.success(res.message);
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
            this.toastr.error(e.message);
        }
    }

}

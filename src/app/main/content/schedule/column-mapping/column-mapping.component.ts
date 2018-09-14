import { Component, OnInit } from '@angular/core';
import { ScheduleService } from '../schedule.service';
import { CustomLoadingService } from '../../../../shared/services/custom-loading.service';
import { SCMessageService } from '../../../../shared/services/sc-message.service';

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
        private scheduleService: ScheduleService,
        private scMessageService: SCMessageService
    ) { }

    async ngOnInit() {
        try {
            this.spinner.show();
            this.map = await this.scheduleService.getColumnMaps();
            this.groups = Object.keys(this.map);
            this.spinner.hide();
        } catch (e) {
            this.spinner.hide();
            this.scMessageService.error(e);
        }
    }

    async saveColumnMap(value, item) {
        try {
            //this.toastr.success(res.message);
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

}

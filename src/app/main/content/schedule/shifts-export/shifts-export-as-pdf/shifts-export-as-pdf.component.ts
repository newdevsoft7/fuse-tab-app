import { Component, OnInit, Input } from '@angular/core';

import { AppSettingService } from '@shared/services/app-setting.service';

@Component({
    selector: 'app-shifts-export-as-pdf',
    templateUrl: './shifts-export-as-pdf.component.html',
    styleUrls: ['./shifts-export-as-pdf.component.scss']
})
export class ShiftsExportAsPdfComponent implements OnInit {

    @Input() data: any;

    shifts: any[] = [];
    extraInfo: any[] = [];
    logoUrl: string;

    constructor(
      private appSettingService: AppSettingService,
    ) { }

    ngOnInit() {
        this.logoUrl = this.appSettingService.baseData.logo;

        // Convert extra_info object to an array.
        const extraInfo = this.data.shifts.extra_info;
        const keys = Object.keys(extraInfo);
        keys.forEach(key => this.extraInfo.push(
            {
                id: key,
                label: extraInfo[key]
            }
        ));

        // Filter shift tracking options by dialog options
        this.data.shifts.data.forEach((shift, index) => {
            this.data.shifts.data[index].tracking_options = shift.tracking_options.filter(v => this.checkOption(v));
        });
    }

    // Check whether option display or not
    checkOption(option) {
        return this.data.trackCategories.findIndex(v => v.id == option.tracking_cat_id) > -1;
    }

    getTooltip(option) {
        const category = this.data.trackCategories.find(v => v.id == option.tracking_cat_id);
        return category ? category.label : ''; 
    }

    array(n: number): any[] {
        return Array(n);
    }

}

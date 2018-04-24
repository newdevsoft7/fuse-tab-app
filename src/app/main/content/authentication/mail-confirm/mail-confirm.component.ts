import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '../../../../core/services/config.service';
import { fuseAnimations } from '../../../../core/animations';
import { AppSettingService } from '../../../../shared/services/app-setting.service';

@Component({
    selector   : 'fuse-mail-confirm',
    templateUrl: './mail-confirm.component.html',
    styleUrls  : ['./mail-confirm.component.scss'],
    animations : fuseAnimations
})
export class FuseMailConfirmComponent implements OnInit
{
    backgroundImg: string;

    constructor(
        private fuseConfig: FuseConfigService,
        private appSettingService: AppSettingService
    )
    {
        this.fuseConfig.setSettings({
            layout: {
                navigation: 'none',
                toolbar   : 'none',
                footer    : 'none'
            }
        });
    }

    ngOnInit() {
        this.backgroundImg = this.appSettingService.baseData.background;
    }
}

import { Component, OnInit } from '@angular/core';
import { FuseConfigService } from '../../../../core/services/config.service';
import { fuseAnimations } from '../../../../core/animations';

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
        private fuseConfig: FuseConfigService
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
        this.backgroundImg = (<any>window).tenant.background || 'assets/images/backgrounds/dark-material-bg.jpg';
    }
}

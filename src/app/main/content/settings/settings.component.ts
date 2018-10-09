import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { SettingsService } from './settings.service';
import { Subscription } from 'rxjs/Subscription';
import { MatSidenav } from '@angular/material';
import { SCMessageService } from '../../../shared/services/sc-message.service';


@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, AfterViewInit, OnDestroy {

    selectedSideNav: any;
    private onSideNavChanged: Subscription;

    settings: any[] = [];
    options: any = {};

    @ViewChild('sidenav') private sidenav: MatSidenav;

    constructor(   
        private toastr: ToastrService,
        private settingsService: SettingsService,
        private scMessageService: SCMessageService
    ) {

        this.onSideNavChanged = this.settingsService.getSelectedSideNav().subscribe( 
            selectedSideNav => this.selectedSideNav = selectedSideNav );
    }

    ngOnInit() {
        this.getData();
    }

    private async getData() {
        try {
            this.settings = await this.settingsService.getSetting();
            this.options = await this.settingsService.getSettingOptions();
        } catch (error) {
            this.scMessageService.error(error);
        }
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.sidenav.open();
        }, 200);
    }

    ngOnDestroy(){
        this.onSideNavChanged.unsubscribe();
    }

}

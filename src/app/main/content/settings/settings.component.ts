import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import { SettingsService } from './settings.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { IterableDiffer } from '@angular/core/src/change_detection/differs/iterable_differs';
import { MatSidenav } from '@angular/material';


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
        private settingsService: SettingsService ) {

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
            this.toastr.error(error.message || 'Something is wrong while fetching events.');
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

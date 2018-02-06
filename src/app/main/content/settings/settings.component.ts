import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import { SettingsService } from './settings.service';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { IterableDiffer } from '@angular/core/src/change_detection/differs/iterable_differs';


@Component({
    selector: 'app-settings',
    templateUrl: './settings.component.html',
    styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit, OnDestroy {

    selectedSideNav:any;
    
    private onSideNavChanged: Subscription;

    constructor(   
        private toastr: ToastrService,
        private settingsService: SettingsService ) {

        this.onSideNavChanged = this.settingsService.getSelectedSideNav().subscribe( 
            selectedSideNav => this.selectedSideNav = selectedSideNav );
    }

    ngOnInit() {
  
    }

    ngOnDestroy(){
        this.onSideNavChanged.unsubscribe();
    }

}

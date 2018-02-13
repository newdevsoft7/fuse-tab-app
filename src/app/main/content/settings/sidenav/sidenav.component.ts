import { Component, OnInit } from '@angular/core';
import { fuseAnimations } from '../../../../core/animations';
import { SettingsService } from '../settings.service';


@Component({
    selector: 'app-settings-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss'],
    animations: fuseAnimations
})

export class SettingsSidenavComponent implements OnInit {

    sidenavs:any[];
    selectedSideNav:any;

    constructor(
        private settingsService: SettingsService) { 

        this.sidenavs = this.settingsService.getSideNavs();
        this.changeSideNav( this.sidenavs[0] );
    }

    ngOnInit() {
    }
    
    changeSideNav( sidenav:any ){
        this.selectedSideNav = sidenav;
        this.settingsService.toggleSelectedSideNav( sidenav );
    }    
}

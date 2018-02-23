import {
    Component, OnInit,
    Input, ViewEncapsulation,
    ViewChild, ElementRef
} from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';

import { AgmMap } from '@agm/core';

import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';


@Component({
    selector: 'app-admin-shift-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class AdminShiftMapComponent implements OnInit {

    @Input() shift;

    @ViewChild(AgmMap)
    public agmMap: AgmMap;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    styles = [
        {
            'featureType': 'administrative',
            'elementType': 'labels.text.fill',
            'stylers': [
                {
                    'color': '#444444'
                }
            ]
        },
        {
            'featureType': 'landscape',
            'elementType': 'all',
            'stylers': [
                {
                    'color': '#f2f2f2'
                }
            ]
        },
        {
            'featureType': 'poi',
            'elementType': 'all',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'road',
            'elementType': 'all',
            'stylers': [
                {
                    'saturation': -100
                },
                {
                    'lightness': 45
                }
            ]
        },
        {
            'featureType': 'road.highway',
            'elementType': 'all',
            'stylers': [
                {
                    'visibility': 'simplified'
                }
            ]
        },
        {
            'featureType': 'road.arterial',
            'elementType': 'labels.icon',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'transit',
            'elementType': 'all',
            'stylers': [
                {
                    'visibility': 'off'
                }
            ]
        },
        {
            'featureType': 'water',
            'elementType': 'all',
            'stylers': [
                {
                    'color': '#039be5'
                },
                {
                    'visibility': 'on'
                }
            ]
        }
    ];

    coords: any = {};    // For shift marker cancellation

    markers = [
        {
            lat: -32,
            lng: 117.9355114,
            label: '120',
            icon:"https://staffconnect.net/images/nopic_thumb_female.jpg"
        },
        {
            lat: -31,
            lng: 116.9355114,
            label: '498',
            icon: "https://staffconnect.net/images/nopic_thumb_female.jpg"
        }
        
    ];

    constructor(public dialog: MatDialog) { }

    ngOnInit() {
    }
    
    refreshMap() {
        this.agmMap.triggerResize();
    }

    changePosition(event) {

        // Save the previous coordinates
        this.coords = {
            lat: this.shift.lat,
            lon: this.shift.lon
        };

        this.shift.lat = event.coords.lat;
        this.shift.lon = event.coords.lng;
        
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Really update the position of the shift?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (!result) {  // Cancel shift move
                this.shift.lat = this.coords.lat;
                this.shift.lon = this.coords.lon;
            } 
        });
    }

}

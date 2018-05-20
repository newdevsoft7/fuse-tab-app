import { Component, OnInit, Inject, ViewEncapsulation } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { AgmMap } from '@agm/core';

@Component({
    selector: 'app-staff-shift-check-in-out-dialog',
    templateUrl: './check-in-out-dialog.component.html',
    styleUrls: ['./check-in-out-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class StaffShiftCheckInOutDialogComponent implements OnInit {

    lat: any;
    lon: any;
    file: any;
    formData = new FormData();

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

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<StaffShiftCheckInOutDialogComponent>
    ) {
        if (navigator) {
            navigator.geolocation.getCurrentPosition( pos => {
                this.lon = +pos.coords.longitude;
                this.lat = +pos.coords.latitude;
                this.formData.append('lat', this.lat);
                this.formData.append('lon', this.lon);
            });
        }
    }

    ngOnInit() { }


    save() {
        this.dialogRef.close(this.formData);
    }

    change(event) {
        if (this.formData.has('photo')) { this.formData.delete('photo'); }
        const files = event.target.files; 
        if (files && files.length > 0) {
            this.formData.append('photo', files[0], files[0].name);
        }
    }

}

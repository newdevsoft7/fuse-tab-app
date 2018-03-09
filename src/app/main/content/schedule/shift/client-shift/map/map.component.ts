import {
    Component, OnInit,
    Input, ViewEncapsulation,
    ViewChild, ElementRef
} from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';

import { AgmMap } from '@agm/core';
import { ToastrService } from 'ngx-toastr';

@Component({
    selector: 'app-client-shift-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ClientShiftMapComponent implements OnInit {

    @Input() shift;

    @ViewChild(AgmMap)
    public agmMap: AgmMap;

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

    markers = [];

    constructor(
        private toastr: ToastrService,
        public dialog: MatDialog
    ) { }

    ngOnInit() {
    }
    
    refreshMap() {
        this.agmMap.triggerResize();
    }

}

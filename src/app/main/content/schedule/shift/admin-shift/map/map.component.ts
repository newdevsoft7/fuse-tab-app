import {
  Component, OnInit,
  Input, ViewEncapsulation,
  ViewChild, ElementRef
} from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';

import { AgmMap } from '@agm/core';
import { ToastrService } from 'ngx-toastr';

import { FuseConfirmDialogComponent } from '../../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { ScheduleService } from '../../../schedule.service';
import { TokenStorage } from '../../../../../../shared/services/token-storage.service';


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
  mapCenter: any = {};

  markers = [];
  selectedMarker: any;
  selectedMarkers: any[] = [];
  currentUser: any;

  constructor(
    private scheduleService: ScheduleService,
    private toastr: ToastrService,
    private tokenStorage: TokenStorage,
    public dialog: MatDialog
  ) {
    this.currentUser = tokenStorage.getUser();
  }

  ngOnInit() {
    if (!this.shift.lat) {
      setTimeout(() => {
        this.shift.lat = 52.357971;
        this.shift.lon = -6.516758;
        this.setMapCenter(this.shift.lat, this.shift.lon);
      });
    } else {
      this.setMapCenter(this.shift.lat, this.shift.lon);
    }
  }

  setMapCenter(lat, lon) {
    if (lat === null || lon === null) { return; }
    this.mapCenter = { lat, lon };
  }

  private capitalize = (str) => str.replace(/\b\w/g, l => l.toUpperCase());

  refreshMap() {
    this.scheduleService.getShiftChecks(this.shift.id).subscribe(res => {
      this.markers = res;
      this.agmMap.triggerResize();
    });
  }

  get isClient() {
    return this.currentUser.lvl === 'client';
  }

  getType(type) {
    return this.capitalize(`check ${type.split('_').join(' ')}`);
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
      } else {    // Ok
        this.setMapCenter(this.shift.lat, this.shift.lon);
        this.scheduleService.updateShift(this.shift.id, { lat: this.shift.lat, lon: this.shift.lon })
          .subscribe(res => this.toastr.success(res.message));
      }
    });
  }

  onMarkerClick(marker) {
    this.selectedMarker = marker;
    this.selectedMarkers = [marker];
  }

  onSelect({ selected }) {
    this.selectedMarker = selected[0];
    this.setMapCenter(this.selectedMarker.lat, this.selectedMarker.lon);
  }

  getAvatar(value) {
    switch (value) {
      case 'male_tthumb.jpg':
      case 'female_tthumb.jpg':
      case 'nosex_tthumb.jpg':
        return `/assets/images/avatars/${value}`;
      default:
        return value;
    }
  }

}


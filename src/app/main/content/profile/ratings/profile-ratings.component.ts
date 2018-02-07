import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';

import { ToastrService } from 'ngx-toastr';
import { ProfileRatingsService } from './profile-ratings.service';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

@Component({
    selector: 'app-profile-ratings',
    templateUrl: './profile-ratings.component.html',
    styleUrls: ['./profile-ratings.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileRatingsComponent implements OnInit {

    loadingIndicator = true;
    ratings:any[];
    filteredRatings:any[];
    selectedRatings: any[] = [];
    reorderable = true;

    @ViewChild(DatatableComponent) table: DatatableComponent
    @ViewChild('searchInput') search: ElementRef;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private ratingsService: ProfileRatingsService
    ) {
    }

    ngOnInit() {
        this.getRatings();
    }


    private getRatings() {
        this.ratingsService.getRatings()
            .subscribe(res => {
                this.loadingIndicator = false;
                this.ratings = res;

                this.updateFilter(this.search.nativeElement.value);
            }, err => {
                if (err.status && err.status == 403) {
                    this.toastr.error('You have no permission!');
                }
            });
    }

    onRatingAdd(newRatingName) {
        if (newRatingName === '') {
            return;
        }

        const newRating = { rname: newRatingName };
        this.ratingsService.createRating(newRating)
            .subscribe(res => {
                this.toastr.success(res.message);
                this.getRatings();
            });
    }

    onRemoveRating(rating){
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {

                this.ratingsService.deleteRating(rating.id)
                        .subscribe(res => {
                            this.toastr.success(res.message);
                            this.getRatings();
                        });
            }
        });        
    }


    updateFilter(value) {
        const val = value.toLowerCase();

        const filteredRatings = this.ratings.filter(function (cat) {
            return Object.keys(cat).some(key => {
                ;
                return (cat[key] ? cat[key] : '')
                    .toString()
                    .toLowerCase()
                    .indexOf(val) !== -1 || !val
            })
        });

        this.filteredRatings = filteredRatings;
        if (this.table) {
            this.table.offset = 0;
        }
    }

    onSelect(evt){

    }
    onActivate(evt) {
    }    
}

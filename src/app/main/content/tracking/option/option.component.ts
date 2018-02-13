import { Component, OnInit, ViewEncapsulation, Input, ViewChild, ElementRef, DoCheck, KeyValueDiffers } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import { TrackingOption } from '../tracking.models';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { MatDialog, MatDialogRef } from '@angular/material';
import { TrackingService } from '../tracking.service';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { Subscription } from 'rxjs/Subscription';


@Component({
    selector: 'app-tracking-option',
    templateUrl: './option.component.html',
    styleUrls: ['./option.component.scss']
})

export class TrackingOptionComponent implements OnInit, DoCheck {
    
    @Input() category;

    loadingIndicator = true;
    options: TrackingOption[];
    filteredOptions: TrackingOption[];
    selectedOptions: TrackingOption[] = [];
    reorderable = true;

    @ViewChild(DatatableComponent) table: DatatableComponent;
    @ViewChild('searchInput') search: ElementRef;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    differ: any;
    
    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private trackingService: TrackingService,
        private differs: KeyValueDiffers) {
        this.differ = differs.find({}).create();
    }

    ngOnInit() {
        if ( this.category ){
            this.getOptions(this.category.id);
        } else {
            this.options = null;
        }
    }

    ngDoCheck() {
        const change = this.differ.diff(this.category);
        if (change) {
            this.getOptions(this.category.id);
        }
    }

    private getOptions(categoryId) {
        this.trackingService.getTrackingOptionsByCategory(categoryId).subscribe(
            res => {
                this.loadingIndicator = false;
                this.options = [ ...res ];
                this.updateFilter(this.search.nativeElement.value);
            }, err => {
                if (err.status && err.status == 403) {
                    this.toastr.error('You have no permission!');
                }
            });
    }

    onOptionAdd(newOption) {
        if (newOption === {}) {
            return;
        }
        newOption.tracking_cat_id = this.category.id;
        
        const option = { ...newOption };
        option.active = option.active ? 1 : 0;

        this.trackingService.createTrackingOption(option).subscribe(
            res => {
                const savedOption = { ...res.data };
                this.options.push(savedOption);
                this.updateFilter(this.search.nativeElement.value);
            },
            err => {
                const errors = err.error.errors;
                Object.keys(errors).forEach(v => {
                    this.toastr.error(errors[v]);
                });
            });
    }

    onRemoveOption(option) {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.trackingService.deleteTrackingOption(option.id)
                    .subscribe(res => {
                        this.toastr.success(res.message);
                        this.getOptions(this.category.id);
                    });
            }
        });
    }    

    onChangeActive(option) { 
        const newOption = _.cloneDeep(option);
        newOption.active = newOption.active ? '1' : '0';
        console.log(newOption.active);
        this.trackingService.updateTrackingOption(newOption).subscribe(
            res => {
            },
            err =>{
                option.active = !option.active;
            });
    }
    
    updateFilter(value) {
        const val = value.toLowerCase();

        const filteredOptions = this.options.filter(function (cat) {
            return Object.keys(cat).some(key => {
                ;
                return (cat[key] ? cat[key] : '')
                    .toString()
                    .toLowerCase()
                    .indexOf(val) !== -1 || !val
            })
        });

        this.filteredOptions = filteredOptions;
        if (this.table) {
            this.table.offset = 0;
        }
    }

    onSelect(evt) {
    }
    
    onActivate(evt) {
    }       
}

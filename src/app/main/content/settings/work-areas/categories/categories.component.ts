import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';

import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../../settings.service';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';




@Component({
    selector: 'app-settings-work-areas-categories',
    templateUrl: './categories.component.html',
    styleUrls: ['./categories.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsWorkAreasCategoriesComponent implements OnInit {

    loadingIndicator = true;
    categories:any[];
    filteredCategories:any[];
    selectedCategories: any[] = [];
    reorderable = true;

    @ViewChild(DatatableComponent) table: DatatableComponent
    @ViewChild('searchInput') search: ElementRef;

    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private settingsService: SettingsService) {
    }

    ngOnInit() {
        this.getCategories();
    }

    private getCategories() {
        this.settingsService.getWorkAreaCategories()
            .subscribe(res => {
                this.loadingIndicator = false;
                this.categories = res;

                this.updateFilter(this.search.nativeElement.value);
            }, err => {
                if (err.status && err.status == 403) {
                    this.toastr.error('You have no permission!');
                }
            });
    }

    onCategoryAdd(newCategoryName) {
        if (newCategoryName === '') {
            return;
        }

        const newCategory = { cname: newCategoryName };
        this.settingsService.createWorkAreaCategory(newCategory)
            .subscribe(res => {
                this.toastr.success(res.message);
                this.getCategories();
            });
    }

    onRemoveCategory(category){
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {

                    this.settingsService.deleteWorkAreaCategory(category.id)
                        .subscribe(res => {
                            this.toastr.success(res.message);
                            this.getCategories();
                        });
            }
        });        
    }


    updateFilter(value) {
        const val = value.toLowerCase();

        const filteredCategories = this.categories.filter(function (cat) {
            return Object.keys(cat).some(key => {
                ;
                return (cat[key] ? cat[key] : '')
                    .toString()
                    .toLowerCase()
                    .indexOf(val) !== -1 || !val
            })
        });

        this.filteredCategories = filteredCategories;
        if (this.table) {
            this.table.offset = 0;
        }
    }

    onSelect(evt) {}

    onActivate(evt) {}    
}

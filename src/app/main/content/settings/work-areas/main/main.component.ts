import { Component, OnInit, ViewEncapsulation, ViewChild, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import * as _ from 'lodash';

import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../../settings.service';
import { FuseConfirmDialogComponent } from '../../../../../core/components/confirm-dialog/confirm-dialog.component';
import { WorkAreaFormDialogComponent } from '../dialogs/workarea-form/workarea-form.component';



@Component({
    selector: 'app-settings-work-areas-main',
    templateUrl: './main.component.html',
    styleUrls: ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsWorkAreasMainComponent implements OnInit {

    loadingIndicator = true;
    workareas:any[];
    filteredWorkAreas: any[];
    selectedWorkAreas: any[] = [];
    reorderable = true;
    categories:any[];
    timezones:any[];

    dialogRef: any;

    @ViewChild(DatatableComponent) table: DatatableComponent
    @ViewChild('searchInput') search: ElementRef;

    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private settingsService: SettingsService
    ) {

    }

    ngOnInit() {
        this.getCategories();
        this.getTimezones();
        this.getWorkAreas();
    }

    private getCategories() {
        this.settingsService.getWorkAreaCategories()
            .subscribe(res => {
                this.loadingIndicator = false;
                this.categories = res;

            }, err => {
                if (err.status && err.status == 403) {
                    this.toastr.error('You have no permission!');
                }
            });
    }

    private getWorkAreas() {
        this.settingsService.getWorkAreas()
            .subscribe(res => {
                this.loadingIndicator = false;
                this.workareas = res;

                this.updateFilter(this.search.nativeElement.value);
            }, err => {
                if (err.status && err.status == 403) {
                    this.toastr.error('You have no permission!');
                }
            });
    }

    private getTimezones() {
        this.settingsService.getTimezones()
            .subscribe(res => {
                this.loadingIndicator = false;
                this.timezones = [];
                Object.keys( res ).forEach( key =>{
                    this.timezones.push({ id:key, name:res[key]});
                });

            }, err => {
                if (err.status && err.status == 403) {
                    this.toastr.error('You have no permission!');
                }
            });
    }

    onWorkAreaAdd(workarea) {
        if (workarea==={}) {
            return;
        }

        const newWorkArea = { ...workarea };
        console.log(newWorkArea);
        this.settingsService.createWorkArea(newWorkArea)
            .subscribe(res => {
                this.toastr.success(res.message);

                this.getWorkAreas();
            });
    }

    onRemoveWorkArea(workarea) {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {

                this.settingsService.deleteWorkArea(workarea.id)
                    .subscribe(res => {
                        this.toastr.success(res.message);

                        this.getWorkAreas();
                        this.updateFilter(this.search.nativeElement.value);
                        
                    });
            }
        });
    }


    updateFilter(value) {
        const val = value.toLowerCase();

        const filteredWorkAreas = this.workareas.filter(function (cat) {
            return Object.keys(cat).some(key => {
                ;
                return (cat[key] ? cat[key] : '')
                    .toString()
                    .toLowerCase()
                    .indexOf(val) !== -1 || !val
            })
        });

        this.filteredWorkAreas = filteredWorkAreas;
        if (this.table) {
            this.table.offset = 0;
        }
    }

    onEditWorkArea(workarea) {
        this.dialogRef = this.dialog.open(WorkAreaFormDialogComponent, {
            panelClass: 'workarea-form-dialog',
            data: { workarea: workarea, categories: this.categories, timezones:this.timezones }
        });

        this.dialogRef.afterClosed()
            .subscribe((workarea) => {
                if (!workarea) {
                    return;
                }
                this.settingsService
                    .updateWorkArea(workarea.id, workarea)
                    .subscribe(res => {
                        this.toastr.success(res.message);
                        this.getWorkAreas();
                    }, err => {
                        this.toastr.error(err.error.errors.email[0])
                    });
            });
    }

    onSelect(evt) {
    }

    onActivate(evt) {     
    } 

}

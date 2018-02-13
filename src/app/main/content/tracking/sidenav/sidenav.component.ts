import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { TrackingService } from '../tracking.service';
import { TrackingCategory } from '../tracking.models';
import { Subscription } from 'rxjs/Subscription';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { MatDialogRef, MatDialog } from '@angular/material';
import { ToastrService } from 'ngx-toastr';


@Component({
    selector: 'app-tracking-sidenav',
    templateUrl: './sidenav.component.html',
    styleUrls: ['./sidenav.component.scss']
})
export class TrackingSidenavComponent implements OnInit, OnDestroy {

    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    selectedCategory: TrackingCategory;
    private onSelectedCategoryChanged: Subscription;

    @Input() categories;

    constructor(
        private trackingService: TrackingService,
        public dialog: MatDialog,
        private toastr: ToastrService) { 

        this.onSelectedCategoryChanged = this.trackingService.getSelectedCategory().subscribe(
            category => {
                this.selectedCategory = category;
            });
    }

    ngOnInit() {
    }

    ngOnDestroy(){
        this.onSelectedCategoryChanged.unsubscribe();
    }

    changeCategory(category:TrackingCategory ){
        this.selectedCategory = category;
        this.trackingService.toggleSelectedCategory(this.selectedCategory );
        this.trackingService.toggleCategories(this.categories);
    }

    onRemoveCategory(event, category){
        event.stopPropagation();

        let isSelected = category === this.selectedCategory;
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.trackingService.deleteTrackingCategory(category.id).subscribe(
                    res => {
                        if (this.categories) {
                            const index = this.categories.findIndex(c => c == category);
                            this.categories.splice(index, 1);
                            this.trackingService.toggleCategories(this.categories);
                            if (isSelected) this.changeCategory(this.categories[0]);
                        }
                    },
                    err => {
                        const errors = err.error.errors.data;
                        errors.forEach(v => {
                            this.toastr.error(v);
                        });
                    });
            }
        });

    }    
}

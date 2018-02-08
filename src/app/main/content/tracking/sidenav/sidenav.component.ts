import { Component, OnInit, OnDestroy } from '@angular/core';
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

    categories:TrackingCategory[];
    selectedCategory:TrackingCategory;
    private onSelectedCategoryChanged: Subscription;
    private onCategoriesChanged: Subscription;    

    constructor( 
        private trackingService: TrackingService,
        public dialog: MatDialog,
        private toastr: ToastrService) { 

        this.onCategoriesChanged = this.trackingService.getCategories().subscribe(
            categeories => {
                this.categories = categeories;
                this.changeCategory(this.categories[0]);
            });
            
            
        this.onSelectedCategoryChanged = this.trackingService.getSelectedCategory().subscribe(
            category => {
                this.selectedCategory = category;
            });
    }

    ngOnInit() {
    }

    ngOnDestroy(){
        this.onSelectedCategoryChanged.unsubscribe();
        this.onCategoriesChanged.unsubscribe();        
    }


    changeCategory(category:TrackingCategory ){
        this.selectedCategory = category;
        //if ( !this.selectedCategory ) return;
        this.trackingService.toggleSelectedCategory(this.selectedCategory );
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
                            let index = this.categories.findIndex(c => c == category);
                            this.categories.splice(index, 1);
                            if (isSelected) this.changeCategory( this.categories[0] );
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

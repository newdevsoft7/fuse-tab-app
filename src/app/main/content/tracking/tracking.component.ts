import { Component, OnInit, OnDestroy, AfterViewInit, ViewChild, IterableDiffer, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';

import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';
import { MatSidenav } from '@angular/material';
import { TrackingService } from './tracking.service';
import { TrackingCategory } from './tracking.models';
import { TokenStorage } from '../../../shared/services/token-storage.service';

@Component({
    selector: 'app-tracking',
    templateUrl: './tracking.component.html',
    styleUrls: ['./tracking.component.scss']
})
export class TrackingComponent implements OnInit, AfterViewInit, OnDestroy {

    categories: TrackingCategory[];
    selectedCategory:TrackingCategory;
    private onSelectedCategoryChanged: Subscription;
    private onCategoriesChanged:Subscription;

    @ViewChild('sidenav') private sidenav: MatSidenav;

    @Input() data: any;

    constructor(
        private toastr: ToastrService,
        private tokenStorage: TokenStorage,
        private trackingService: TrackingService) {

        this.onCategoriesChanged = this.trackingService.getCategories().subscribe(
            categories => {
                this.categories = categories;
                let index = this.categories.findIndex(category => category.id === this.selectedCategory.id);
                if (index === -1) {
                    this.selectedCategory = null;
                }
            });

        this.onSelectedCategoryChanged = this.trackingService.getSelectedCategory().subscribe( 
            category => {
                this.selectedCategory = category;
            });

    }

    ngOnInit() {
        this.trackingService.toggleSelectedCategory(this.data);
        this.getTrackingCategories();
    }

    ngOnDestroy() {
        this.onSelectedCategoryChanged.unsubscribe();
        this.onSelectedCategoryChanged.unsubscribe();
    }

    ngAfterViewInit(): void {
        setTimeout(() => {
            this.sidenav.open();
        }, 200);
    }

    getTrackingCategories() {
        this.categories = this.tokenStorage.getSettings().tracking;
    }

    onCategoryAdd(newCategory) {
        if (newCategory === {}) {
            return;
        }

        const category = new TrackingCategory(newCategory);
        this.trackingService.createTrackingCategory(category).subscribe(
            res => {
                const savedCategory = { ...res.data };
                this.categories.push(savedCategory);
                this.trackingService.toggleSelectedCategory(savedCategory);
                this.trackingService.toggleCategories(this.categories);
            },
            err => {
                const errors = err.error.errors;
                Object.keys(errors).forEach(v => {
                    this.toastr.error(errors[v]);
                });
            });
    }
}

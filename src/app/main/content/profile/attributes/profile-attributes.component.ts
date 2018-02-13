import {
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

import { ProfileAttributesService } from './profile-attributes.service';

import * as _ from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { ProfileAttribute, ProfileAttributeCategory } from './profile-attribute.models';
import { ProfileAttributesAttributeDialogComponent } from './dialogs/attribute/attribute.component';


@Component({
    selector: 'app-profile-attributes',
    templateUrl: './profile-attributes.component.html',
    styleUrls: ['./profile-attributes.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileAttributesComponent implements OnInit {

    categories: any[];
    attributes: ProfileAttribute[];
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private attributesService: ProfileAttributesService,
        private toastr: ToastrService, 
        public dialog: MatDialog) {
    }

    ngOnInit() {
        this.getAttributesAndCategories();
    }
    
    getCategories(){
        this.attributesService.getCategories()
            .subscribe(
                res => {
                    this.categories = [ ...res ];
                    this.categories.unshift({ id: null, cname: 'Uncategorised', display_order: 0 } );
                    
                    this.attributesMapToCategories();
                    this.SortbyDisplayOrder( this.categories );
                },
                err => {
                    console.log(err);
                }
            );
    }

    getAttributesAndCategories() {
        this.attributesService.getAttributes()
            .subscribe(
                res => {
                    res.forEach(attribute => attribute.role_default = attribute.role_default || '');
                    this.attributes = [ ...res ];
                    this.SortbyDisplayOrder( this.attributes );
                    this.getCategories();
                },
                err => {
                    console.log(err);
                }
            );
    }


    getAttributesOfCategory(category){
        return this.attributes.filter(attribute => category.id == attribute.attribute_cat_id);
    }

    onCategoryAdd(newCategoryName) {
        if (newCategoryName === '') {
            return;
        }

        const newCategory = new ProfileAttributeCategory({ cname: newCategoryName });
        this.attributesService.createCategory(newCategory).subscribe(
            res => {
                const savedCategory = res.data;
                savedCategory.attributes = [];
                this.categories.push(savedCategory);
            },
            err => {
                const errors = err.error.errors;
                Object.keys(errors).forEach(v => {
                    this.toastr.error(errors[v]);
                });
            });
    }

    onAttributeAdd(newAttribute) {
        if (newAttribute === {}) {
            return;
        }
        const attribute = new ProfileAttribute(newAttribute);

        this.attributesService.createAttribute(attribute).subscribe(
            res => {
                const savedAttribute = res.data;
                const category = this.categories.find(c => c.id == savedAttribute.attribute_cat_id);
                if (!category.attributes) { category.attributes = []; }
                category.attributes.push(attribute);
                this.attributes.push(attribute);
            },
            err => {
                const errors = err.error.errors;
                Object.keys(errors).forEach(v => {
                    this.toastr.error(errors[v]);
                });
            });
    }

    onAddAttribute(category) {
        this.dialogRef = this.dialog.open(ProfileAttributesAttributeDialogComponent, {
            panelClass: 'profile-attributes-attribute-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe((newAttribute: ProfileAttribute) => {
                if (newAttribute) {
                    newAttribute.attribute_cat_id = category.id;

                    this.attributesService.createAttribute(newAttribute).subscribe(
                        res => {
                            const savedAttribute = res.data;
                            if (!category.attributes) { category.attributes = []; }
                            category.attributes.push(savedAttribute);
                            this.attributes.push(savedAttribute);
                        },
                        err => {
                            const errors = err.error.errors;
                            Object.keys(errors).forEach(v => {
                                this.toastr.error(errors[v]);
                            });
                        });
                }
            });
    }
    
    onRemoveCategory(category) {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.removeCategory(category);
            }
        });
    }
    
    onRemoveAttribute(attribute) {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.removeAttribute(attribute);
            }
        });        
    }

    private removeCategory(category) {

        let attrs = [...this.getAttributesOfCategory(category)];

        this.attributesService.deleteCategory(category.id).subscribe(
            res => {
                if (this.categories){
                    const index = this.categories.findIndex(c => c == category);
                    this.categories.splice(index, 1);
                    attrs.forEach(attribute => {
                        attribute.attribute_cat_id = null;
                        const Uncategorised = this.getUncategorisedCategory();
                        Uncategorised.attributes.push(attribute);

                    });                    
                }
            },
            err => {
                const errors = err.error.errors.data;
                errors.forEach(v => {
                    this.toastr.error(v);
                });
            });     
    }

    private removeAttribute(attribute) {
        this.attributesService.deleteAttribute(attribute.id).subscribe( 
            res =>{
                let index = this.attributes.findIndex(a => a == attribute);
                this.attributes.splice(index, 1);
                let category = this.categories.find(c => c.id == attribute.attribute_cat_id);
                index = category.attributes.findIndex(a => a == attribute);
                category.attributes.splice(index, 1);
            },
            err => {
                const errors = err.error.errors.data;
                errors.forEach(v => {
                    this.toastr.error(v);
                });
            });
    }

    onDropCategory(evt) {
        this.categoriesReorder(this.categories);
    }

    onDropAttribute(evt){
        const attribute: ProfileAttribute = evt.value;
        let parentCategory = null;
        this.categories.forEach(category => {
            let index = category.attributes.findIndex(a => a == attribute);
            if (index >= 0) {
                parentCategory = category;
                return;
            }
        });

        attribute.attribute_cat_id = parentCategory.id;
        this.attributesReorder(parentCategory.attributes);
    }

    clickCategory(model, evt) {
        evt.stopPropagation();
    }

    clickAttribute(model, evt) {
        evt.stopPropagation();
    }

    SortbyDisplayOrder(arr:any[]){
        arr.sort((a, b) => {
            return parseInt(a.display_order) - parseInt(b.display_order);
        });        
    }

    categoriesReorder(cats: any[]){
        cats.map(category => {
            category.display_order = this.categories.findIndex(c => c == category);
        }); 
        
        cats.forEach( category =>{
            if (!category.id) return;
            this.attributesService.updateCategory(category).subscribe(
                res => {
                },
                err => {
                    const errors = err.error.errors;
                    Object.keys(errors).forEach(v => {
                        this.toastr.error(errors[v]);
                    });
                });
        });
    }

    attributesReorder(attrs:any[]) {
        attrs.map(attribute => {
            attribute.display_order = attrs.findIndex(a => a == attribute).toString();
        });

        attrs.forEach(attribute => {
            this.attributesService.updateAttribute(attribute).subscribe(
                res => {
                },
                err => {
                    const errors = err.error.errors;
                    Object.keys(errors).forEach(v => {
                        this.toastr.error(errors[v]);
                    });
                });
        });        
    }

    attributesMapToCategories(){
        this.categories.map(category => {
            category.attributes = this.getAttributesOfCategory(category);
        });        
    }

    getUncategorisedCategory(){
        return this.categories.find(c => c.id == null);
    }
}

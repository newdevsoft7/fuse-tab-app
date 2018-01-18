import {
    Component,
    OnInit,
    ViewEncapsulation
} from '@angular/core';

import { MatDialog, MatDialogRef } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';

import { ProfileInfoService } from './profile-info.service';
import { ProfileField } from '../profile-field.model';
import { ProfileInfoCategoryDialogComponent } from './dialogs/category/category.component';
import { ProfileInfoElementDialogComponent } from './dialogs/element/element.component';
import { ProfileInfoEditElementOptionsDialogComponent } from './dialogs/edit-element-options/edit-element-options.component';

import * as _ from 'lodash';

@Component({
    selector: 'app-profile-info',
    templateUrl: './profile-info.component.html',
    styleUrls: ['./profile-info.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileInfoComponent implements OnInit {

    profileFields: any[] = [];
    dialogRef: any;
    confirmDialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    constructor(
        private profileInfoService: ProfileInfoService,
        public dialog: MatDialog) { }

    ngOnInit() {
        this.profileInfoService.getFields()
            .subscribe(
                res => {
                    this.profileFields = [ ...res ];
                },
                (err) => {
                    console.log(err);
                }
            );
    }

    onDrop(evt) {
        const node: ProfileField = evt.value;
        const parent = this.findParent(node, this.profileFields);
        node.profile_cat_id = parent == this.profileFields ? null : (parent as ProfileField).id;
        const element = _.cloneDeep(node);
        if (node.cname) {
            delete element.cname;
            this.profileInfoService.updateCategory(element)
                .subscribe(_ => {
                }, error => {
                });
        } else {
            this.profileInfoService.updateElement(node)
                .subscribe(_ => {
                }, error => {
                });
        }

    }

    click(model, evt) {
        evt.stopPropagation();
    }

     onAddCategory(category) {
        this.dialogRef = this.dialog.open(ProfileInfoCategoryDialogComponent, {
            panelClass: 'profile-info-category-dialog',
            data: {
                category: new ProfileField({}),
                isCreate: true
            }
        });
        this.dialogRef.afterClosed()
            .subscribe((newCategory: ProfileField) => {
                if (newCategory) {
                    newCategory.profile_cat_id = category.id;
                    this.profileInfoService.createCategory(newCategory)
                        .subscribe(res => {
                            const savedCategory = res.data;
                            if (!category.elements) { category.elements = []; }
                            category.elements.push(savedCategory);
                        });
                }
            });
    }

    onAddField(category) {
        this.dialogRef = this.dialog.open(ProfileInfoElementDialogComponent, {
            panelClass: 'profile-info-field-dialog'
        });
        this.dialogRef.afterClosed()
            .subscribe((newField: ProfileField) => {
                if (newField) {
                    newField.profile_cat_id = category.id;
                    
                    this.profileInfoService.createElement(newField)
                        .subscribe(res => {
                            const savedField = res.data;
                            savedField.editable = '1';
                            savedField.deletable = '1';
                            if (!category.elements) { category.elements = []; }
                            category.elements.push(savedField);
                        });
                }
            });
    }

    onEditFieldOptions(field) {
        this.dialogRef = this.dialog.open(ProfileInfoEditElementOptionsDialogComponent, {
            panelClass: 'profile-info-edit-field-options-dialog',
            data: {
                field
            }
        });
        this.dialogRef.afterClosed()
            .subscribe((modifiedField: ProfileField) => {
                if (modifiedField) {
                    this.profileInfoService.updateElement(modifiedField)
                        .subscribe(res => {
                            const savedField = res.data;
                            field.filter = savedField.filter;
                            field.options = modifiedField.options;
                        });
                }
            });
    }

    onCategoryAdd(newCategoryName) {
        if (newCategoryName === '') {
            return;
        }

        const newCategory = new ProfileField({ cname: newCategoryName });
        this.profileInfoService.createCategory(newCategory)
            .subscribe(res => {
                const savedCategory = res.data;
                this.profileFields.push(savedCategory);
            });
    }

    onFieldAdd(newField) {
        if (newField === {}) {
            return;
        }
        const field = new ProfileField(newField);
        this.profileInfoService.createElement(field)
            .subscribe(res => {
                const savedField = res.data;
                savedField.editable = '1';
                savedField.deletable = '1';
                const category = this.profileFields.find(v => v.id == savedField.profile_cat_id && v.cname);
                if (!category.elements) { category.elements = []; }
                category.elements.push(savedField);
            });
    }

    onRemoveNode(node) {
        this.confirmDialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });

        this.confirmDialogRef.componentInstance.confirmMessage = 'Are you sure you want to delete?';

        this.confirmDialogRef.afterClosed().subscribe(result => {
            if (result) {
                if (node.cname) {
                    this.profileInfoService.deleteCategory(node.id)
                        .subscribe(res => {
                            this.removeNode(node);
                        });
                } else {
                    this.profileInfoService.deleteElement(node.id)
                        .subscribe(res => {
                            this.removeNode(node);
                        });
                }
            }
        });
    }
    
    private removeNode(node) {
        let parent = this.findParent(node, this.profileFields);
        parent = parent == this.profileFields ? parent : parent.elements;
        const index = parent.findIndex(v => v == node);
        parent.splice(index, 1);
    }

    private findParent(element, searched) {
        if (searched instanceof Array) {
            const index = this.profileFields.findIndex(v => v == element);
            if (index < 0) {
                const filtered = searched.filter(v => v.elements && v.elements.length);
                if (filtered.length > 0) {
                    let result = null;
                    filtered.every(v => {
                        result = this.findParent(element, v);
                        return result ? false : true;
                    });
                    return result;
                } else {
                    return null;
                }
            } else {
                return searched;
            }
        } else {
            if (searched.elements && searched.elements.length) {
                const index = searched.elements.findIndex(v => v == element);
                if (index > -1) {
                    return searched;
                } else {
                    const filtered = searched.elements.filter(v => v.elements && v.elements.length);
                    if (filtered.length > 0) {
                        let result = null;
                        filtered.every(v => {
                            result = this.findParent(element, v);
                            return result ? false : true;
                        });
                        return result;
                    } else {
                        return null;
                    }
                }
            } 
        }
    }
}

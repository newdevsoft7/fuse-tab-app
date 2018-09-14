import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { ProfileExperienceService } from './experience.service';
import { MatDialog } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { ExperienceHeadingDialogComponent } from './heading-dialog/heading-dialog.component';
import { SCMessageService } from '../../../../shared/services/sc-message.service';

@Component({
    selector: 'app-profile-experience',
    templateUrl: './experience.component.html',
    styleUrls: ['./experience.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileExperienceComponent implements OnInit {

    categories: any[] = []; // array of categories, each category has array of headings

    constructor(
        private experienceService: ProfileExperienceService,
        private toastr: ToastrService,
        private scMessageService: SCMessageService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.init();
    }

    async init() {
        try {
            this.categories = await this.experienceService.getCategories();
        } catch (e) {
            this.toastr.error(e.message || 'Something is wrong!');
        }
    }

    async onCategoryAdded(cname) {
        try {
            const res = await this.experienceService.createCategory(cname);
            //this.toastr.success(res.message);
            this.categories.push(res.data);
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

    deleteCategory(category) {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                try {
                    const index = this.categories.findIndex(c => c.id === category.id);
                    this.categories.splice(index, 1);
                    const res = await this.experienceService.deleteCategory(category.id);
                    //this.toastr.success(res.message);
                } catch (e) {
                    this.scMessageService.error(e);
                }
            }
        });
    }

    async updateCategoriesDisplayOrder(v) {
        try {
            const elements: any[] = this.categories.map(c => c.id);
            const res = await this.experienceService.updateCategoriesDisplayOrder(elements);
            //this.toastr.success(res.message);
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

    async updateHeadingsDisplayOrder(v, category) {
        try {
            const elements: any[] = category.headings.map(h => h.id);
            const res = await this.experienceService.updateHeadingsDisplayOrder({ elements });
            //this.toastr.success(res.message);
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

    async updateCategory(cname, category) {
        if (!cname) {
            const temp = category.cname;
            category.cname = `${temp} `;
            setTimeout(() => category.cname = temp);
            return;
        }
        try {
            const res = await this.experienceService.updateCategory(category.id, { cname });
            category.cname = cname;
            //this.toastr.success(res.message);
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

    addHeading(category) {
        const dialogRef = this.dialog.open(ExperienceHeadingDialogComponent, {
            disableClose: false,
            panelClass: 'experience-heading-form-dialog',
            data: {
                category
            }
        });
        dialogRef.afterClosed().subscribe(async (heading) => {
            if (heading) {
                try {
                    const res = await this.experienceService.createHeading({
                        hname: heading.hname,
                        experience_cat_id: category.id,
                        type: heading.type
                    });
                    const newHeading = {
                        hname: res.data.hname,
                        type: res.data.type,
                        display_order: res.data.display_order,
                        id: res.data.id,
                        date: 0,
                        role: 0,
                        options: []
                    };
                    if (heading.type === 'list') {
                        const options = heading.options.filter(o => !o.deleted && o.changed && o.oname);
                        if (options.length > 0) {
                            const optResponse: any[] = await Promise.all(
                                options.map(
                                    o => this.experienceService.createHeadingOption({ oname: o.oname, experience_heading_id: newHeading.id })
                                )
                            );
                            optResponse.forEach(oRes => {
                                newHeading.options.push(
                                    {
                                        id: oRes.data.id,
                                        oname: oRes.data.oname
                                    }
                                );
                            });
                        }
                    }
                    //this.toastr.success('Saved.');
                    category.headings.push(newHeading);
                } catch (e) {
                    this.scMessageService.error(e);
                }
            }
        });
    }

    editHeading(heading, category) {
        const dialogRef = this.dialog.open(ExperienceHeadingDialogComponent, {
            disableClose: false,
            panelClass: 'experience-heading-form-dialog',
            data: {
                heading
            }
        });
        dialogRef.afterClosed().subscribe(async(newHeading) => {
            if (newHeading) {
                try {
                    const res = await this.experienceService.updateHeading(newHeading.id, { hname: newHeading.hname, type: newHeading.type });
                    
                    // Update heading
                    heading.hname = res.data.hname;
                    heading.type = res.data.type;
                    if (heading.type === 'list') {
                        const options = newHeading.options.filter(o => !o.deleted && !o.changed && o.id) || [];
                        const deletedOptions = newHeading.options.filter(o => o.deleted && o.id);
                        const createdOptions = newHeading.options.filter(o => !o.deleted && o.changed && o.oname && !o.id);
                        const updatedOptions = newHeading.options.filter(o => !o.deleted && o.id && o.changed && o.oname);

                        // First, create new options
                        let optRes: any[] = await Promise.all(
                            createdOptions.map(
                                o => this.experienceService.createHeadingOption({ oname: o.oname, experience_heading_id: newHeading.id })
                            )
                        );
                        optRes.forEach(oRes => {
                            options.push(
                                {
                                    id: oRes.data.id,
                                    oname: oRes.data.oname
                                }
                            );
                        });

                        // Second, update options
                        optRes = await Promise.all(
                            updatedOptions.map(
                                o => this.experienceService.updateHeadingOption(o.id, { oname: o.oname })
                            )
                        );
                        optRes.forEach(oRes => {
                            options.push(
                                {
                                    id: oRes.data.id,
                                    oname: oRes.data.oname
                                }
                            );
                        });

                        heading.options = options;

                        // Finally, delete options
                        optRes = await Promise.all(
                            deletedOptions.map(
                                o => this.experienceService.deleteHeadingOption(o.id)
                            )
                        );
                    } else {
                        heading.options = [];
                    }
                    //this.toastr.success('Saved.');
                } catch (e) {
                    this.scMessageService.error(e);
                }
            }
        });
    }

    deleteHeading(heading, category) {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(async (result) => {
            if (result) {
                try {
                    const index = category.headings.findIndex(h => h.id === heading.id);
                    category.headings.splice(index, 1);
                    const res = await this.experienceService.deleteHeading(heading.id);
                    //this.toastr.success(res.message);
                } catch (e) {
                    this.scMessageService.error(e);
                }
            }
        });
    }

}

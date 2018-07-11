import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { ActionService } from '../../../../shared/services/action.service';
import { MatDialog, MatDrawer, MatSelectChange } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { UsersAddPresentationDialogComponent } from './dialogs/add-presentation-dialog/add-presentation-dialog.component';

@Component({
    selector: 'app-users-presentations',
    templateUrl: './presentations.component.html',
    styleUrls: ['./presentations.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersPresentationsComponent implements OnInit, OnDestroy {
    
    @ViewChild('drawer') drawer: MatDrawer;

    presentations: any[] = [];
    selectedPresentation: any;
    presentationData: any;
    selectedPresentationIdSubscription: Subscription;

    constructor(
        private toastr: ToastrService,
        private userService: UserService,
        private actionService: ActionService,
        private dialog: MatDialog
    ) { }

    ngOnInit() {
        this.selectedPresentationIdSubscription = this.actionService.selectedPresentationId$.subscribe(async(id) => {
            if (id) {
                const index = this.presentations.findIndex(p => p.id == id);
                if (index > -1) {
                    this.selectPresentation(id);
                } else {
                    try {
                        await this.getPresentations();
                        this.selectPresentation(id);
                    } catch (e) {
                        this.displayError(e);
                    }
                }
            } else {
                this.getPresentations();
            }
            this.drawer.open(); 
        });
    }

    ngOnDestroy() {
        this.selectedPresentationIdSubscription.unsubscribe();
        this.actionService.selectedPresentationId$.next(null);
        this.actionService.selectedPresentationId = null;
    }

    async selectPresentation(id: number) {
        try {
            const index = this.presentations.findIndex(p => p.id == id);
            if (index > -1) {
                this.presentationData = await this.userService.getPresentation(id);
                this.selectedPresentation = this.presentations[index];
                this.actionService.selectedPresentationId = id;
            }
        } catch (e) {
            this.displayError(e);
        }
    }

    async getPresentations() {
        try {
            this.presentations = await this.userService.getPresentations();
        } catch (e) {
            this.displayError(e);
        }
    }

    addPresentation() {
        const dialogRef = this.dialog.open(UsersAddPresentationDialogComponent, {
            disableClose: false,
            panelClass: 'users-add-presentation-dialog'
        });
        dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    const res = await this.userService.createPresentation({ name: result });
                    this.presentations.push(res);
                } catch (e) {
                    this.displayError(e);
                }
            }
        });
    }

    onShowcaseChange(event: MatSelectChange) {
        const showcaseTemplateId = event.value;
        // Todo - get showcase template
    }

    async updateName(value) {
        const param = { name: value };
        try {
            await this.userService.savePresentation(this.presentationData.presentation.id, param);
            this.presentationData.presentation.name = value;
            this.selectedPresentation.name = value;
        } catch (e) {
            this.displayError(e);
        }
    }

    async deletePresentation(id) {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    await this.userService.deletePresentation(id);
                    const index = this.presentations.findIndex(p => p.id == id);
                    if (index > -1) {
                        this.presentations.splice(index, 1);
                        this.presentationData = null;
                        this.selectedPresentation = null;
                    }
                } catch (e) {
                    this.displayError(e);
                }
            }
        });
    }

    async onRemoveUser(user, index) {
        const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    await this.userService.removeUserFromPresentation(this.presentationData.presentation.id, user.id);
                    this.presentationData.users.splice(index, 1);
                } catch (e) {
                    this.displayError(e);
                }
            }
        });
    }

    onDrop(event) {

    }

    private displayError(e: any) {
        const errors = e.error.errors;
        if (errors) {
            Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
        }
        else {
            this.toastr.error(e.error.message);
        }
    }

}

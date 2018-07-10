import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDrawer, MatDialogRef, MatDialog, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { TabService } from '../../../tab/tab.service';
import { UsersAddCardDialogComponent } from './dialogs/add-card-dialog/add-card-dialog.component';
import { UserService } from '../user.service';

@Component({
    selector: 'app-users-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss']
})
export class UsersCardsComponent implements OnInit {

    @ViewChild('drawer') drawer: MatDrawer;
    dialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    cards: any[] = [];
    cardData: any = null;
    selectedCard: any = null;
    showcaseTemplates: any[] = [];
    
    constructor(
        private toastr: ToastrService,
        private tabService: TabService,
        private dialog: MatDialog,
        private userService: UserService
    ) { }

    ngOnInit() {
        this.getCards();
    }

    addCard() {
        const dialogRef = this.dialog.open(UsersAddCardDialogComponent, {
            disableClose: false,
            panelClass: 'users-add-card-dialog'
        });
        dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    const res = await this.userService.createCard(result);
                    this.cards.push(res);
                } catch (e) {
                    this.displayError(e);
                }
            }
        });
    }

    async getCards() {
        try {
            this.cards = await this.userService.getCards();
            if (this.cards.length > 0) {
                this.selectCard(this.cards[0]);
            }
        } catch (e) {
            this.displayError(e);
        }
        this.drawer.open();
    }

    async selectCard(card) {
        this.selectedCard = card;
        try {
            this.cardData = await this.userService.getCard(card.id);
        } catch (e) {
            this.displayError(e);
        }
    }

    deleteCard(id) {
        this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
            disableClose: false
        });
        this.dialogRef.componentInstance.confirmMessage = 'Are you sure?';
        this.dialogRef.afterClosed().subscribe(async(result) => {
            if (result) {
                try {
                    const index = this.cards.findIndex(v => v.id === id);
                    if (index > -1) {
                        this.cards.splice(index, 1);
                        this.selectedCard = null;
                        this.cardData = null;
                    }
                    await this.userService.deleteCard(id);
                } catch (e) {
                    this.displayError(e);
                }
            }
        });
    }

    async tag(cardId, type: 'photo' | 'video', tag) {
        try {
            await this.userService.tagCard(cardId, type, tag);
        } catch (e) {
            this.displayError(e);
        }
    }

    async untag(cardId, type: 'photo' | 'video', tag) {
        try {
            await this.userService.untagCard(cardId, type, tag);
        } catch (e) {
            this.displayError(e);
        }
    }

    async getShowcaseTemplates() {
        try {
            this.showcaseTemplates = await this.userService.getShowcaseTemplates();
        } catch (e) {
            this.displayError(e);
        }
    }

    onShowcaseChange(event: MatSelectChange) {
        const showcaseTemplateId = event.value;
        // Todo - get showcase template
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

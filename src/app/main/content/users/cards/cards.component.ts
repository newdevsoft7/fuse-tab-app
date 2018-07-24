import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatDrawer, MatDialogRef, MatDialog, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';

import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { TabService } from '../../../tab/tab.service';
import { UsersAddCardDialogComponent } from './dialogs/add-card-dialog/add-card-dialog.component';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs/Subscription';
import { ConnectorService } from '../../../../shared/services/connector.service';
import { TabComponent } from '../../../tab/tab/tab.component';
import { Tab } from '../../../tab/tab';
import { ShowcaseService } from '../../showcase/showcase.service';

@Component({
    selector: 'app-users-cards',
    templateUrl: './cards.component.html',
    styleUrls: ['./cards.component.scss']
})
export class UsersCardsComponent implements OnInit, OnDestroy {

    @ViewChild('drawer') drawer: MatDrawer;
    dialogRef: MatDialogRef<FuseConfirmDialogComponent>;

    cards: any[] = [];
    cardData: any = null;
    selectedCard: any = null;
    showcaseTemplates: any[] = [];

    cardSubscription: Subscription;
    
    constructor(
        private toastr: ToastrService,
        private tabService: TabService,
        private dialog: MatDialog,
        private userService: UserService,
        private connectorService: ConnectorService,
        private showcaseService: ShowcaseService
    ) { }

    ngOnInit() {
        this.getCards();

        this.cardSubscription = this.connectorService.currentShowcaseTab$.subscribe(async (tab: TabComponent) => {
            if (!tab) return;
            if (/showcase\/card\/([0-9]+)\/template\/new/.test(tab.url)) {
                this.tabService.closeTab(tab.url);
                const card = tab.data.payload.card;
                try {
                    const res = await this.showcaseService.saveTemplate(tab.data.template);
                    card.showcase_template_id = res.data.id;
                    const { message } = await this.userService.updateCard(card.id, card);
                    this.cardData.showcase_templates.push({ id: res.data.id, name: res.data.name })
                    this.toastr.success(message);
                } catch (e) {
                    this.toastr.error(e.error.message);
                }
                this.connectorService.currentShowcaseTab$.next(null);
            }
        });
    }

    ngOnDestroy() {
        this.cardSubscription.unsubscribe();
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

    openShowcaseTab() {
        if (!this.cardData.card.showcase_template_id) {
            this.addShowcase();
        }
    }

    private addShowcase(): void {
        const tab = new Tab(
            'New Showcase',
            'showcaseTpl',
            `showcase/card/${this.cardData.card.id}/template/new`,
            {
                name: 'New Showcase Template',
                payload: this.cardData
            }
        );
        this.tabService.openTab(tab);
    }

    private editShowcase(): void {
        // todo
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

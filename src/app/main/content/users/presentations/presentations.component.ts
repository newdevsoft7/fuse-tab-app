import { Component, OnInit, ViewChild, OnDestroy, ViewEncapsulation } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs';
import { UserService } from '../user.service';
import { ActionService } from '../../../../shared/services/action.service';
import { MatDialog, MatDrawer, MatSelectChange } from '@angular/material';
import { FuseConfirmDialogComponent } from '../../../../core/components/confirm-dialog/confirm-dialog.component';
import { UsersAddPresentationDialogComponent } from './dialogs/add-presentation-dialog/add-presentation-dialog.component';
import { Tab } from '../../../tab/tab';
import { TabService } from '../../../tab/tab.service';
import { ConnectorService } from '../../../../shared/services/connector.service';
import { TabComponent } from '../../../tab/tab/tab.component';
import { ShowcaseService } from '../../showcase/showcase.service';
import { SCMessageService } from '../../../../shared/services/sc-message.service';
import * as _ from 'lodash';
import { ObservableMedia } from '@angular/flex-layout';

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
    presentationSubscription: Subscription;
    cards: any = [];
    mediaSubscription: Subscription;
    drawerMode = 'side';

    constructor(
        private toastr: ToastrService,
        private userService: UserService,
        private actionService: ActionService,
        private tabService: TabService,
        private dialog: MatDialog,
        private connectorService: ConnectorService,
        private showcaseService: ShowcaseService,
        private scMessageService: SCMessageService,
        private observableMedia: ObservableMedia
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
                        this.scMessageService.error(e);
                    }
                }
            } else {
                this.getPresentations();
            }
            this.drawer.open(); 
        });

        this.presentationSubscription = this.connectorService.currentShowcaseTab$.subscribe(async (tab: TabComponent) => {
            if (!tab) return;
            if (/showcase\/presentation\/([0-9]+)\/template\/new/.test(tab.url)) {
                this.tabService.closeTab(tab.url);
                const presentation = tab.data.payload.presentation;
                try {
                    const res = await this.showcaseService.getTemplateByOtherId(tab.data.template.id);
                    this.presentationData.showcase_templates.push({ id: res.data.id, name: res.data.name, other_id: res.data.other_id })
                    presentation.showcase_template_id = res.data.id;
                    const { message } = await this.userService.savePresentation(presentation.id, presentation);
                    this.toastr.success(message);
                } catch (e) {
                    this.toastr.error(e.error.message);
                }
                this.connectorService.currentShowcaseTab$.next(null);
            } else if (/showcase\/presentation\/([0-9]+)\/templates\/([0-9]+)\/edit/.test(tab.url)) {
                this.tabService.closeTab(tab.url);
                const template = this.presentationData.showcase_templates.find(tpl => tpl.other_id === tab.data.template.id);
                if (template) {
                    template.name = tab.data.template.name;
                }
                const templates = _.clone(this.presentationData.showcase_templates);
                this.presentationData.showcase_templates.splice(0, templates.length);
                setTimeout(() => this.presentationData.showcase_templates.push(...templates));
                this.connectorService.currentShowcaseTab$.next(null);
            }
        });

        this.mediaSubscription = this.observableMedia.subscribe(() => {
            if (this.observableMedia.isActive('gt-sm')) {
                this.drawerMode = 'side';
                this.drawer.toggle(true);
            } else {
                this.drawerMode = 'over';
                this.drawer.toggle(false);
            }
        });

        this.fetchCards();
    }

    ngOnDestroy() {
        this.selectedPresentationIdSubscription.unsubscribe();
        this.presentationSubscription.unsubscribe();
        this.mediaSubscription.unsubscribe();
        this.actionService.selectedPresentationId$.next(null);
        this.actionService.selectedPresentationId = null;
    }

    async selectPresentation(id: number) {
        try {
            const index = this.presentations.findIndex(p => p.id == id);
            if (index > -1) {
                this.presentationData = await this.userService.getPresentation(id);
                if (this.presentationData.presentation.card_id) {
                    this.presentationData.presentation.card_id = +this.presentationData.presentation.card_id;
                }
                if (this.presentationData.presentation.showcase_template_id) {
                    this.presentationData.presentation.showcase_template_id = +this.presentationData.presentation.showcase_template_id;
                }
                this.selectedPresentation = this.presentations[index];
                this.actionService.selectedPresentationId = id;
            }
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

    async getPresentations() {
        try {
            this.presentations = await this.userService.getPresentations();
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

    async fetchCards() {
        try {
            this.cards = await this.userService.getCards();
        } catch (e) {
            this.scMessageService.error(e);
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
                    this.scMessageService.error(e);
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
            this.scMessageService.error(e);
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
                    this.scMessageService.error(e);
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
                    this.scMessageService.error(e);
                }
            }
        });
    }

    onDrop(event) {

    }

    async onCardChange(event) {
        try {
            await this.userService.savePresentation(this.selectedPresentation.id, {
                card_id: event.value
            });
            this.presentationData.presentation.card_id = event.value;
        } catch (e) {
            this.scMessageService.error(e);
        }
    }

    private addShowcase(): void {
        const tab = new Tab(
            'New Showcase',
            'showcaseTpl',
            `showcase/presentation/${this.presentationData.presentation.id}/template/new`,
            {
                name: 'New Showcase Template',
                payload: this.presentationData,
                type: 'presentation'
            }
        );
        this.tabService.openTab(tab);
    }

    private editShowcase(): void {
        const template = this.presentationData.showcase_templates.find(v => v.id === this.presentationData.presentation.showcase_template_id);
        if (!template) return;
        const tab = new Tab(
            template.name,
            'showcaseTpl',
            `showcase/presentation/${this.presentationData.presentation.id}/templates/${this.presentationData.presentation.showcase_template_id}/edit`,
            {
                name: template.name,
                payload: this.presentationData,
                type: 'presentation',
                template_id: template.other_id,
                edit: true
            }
        );
        this.tabService.openTab(tab);
    }

}

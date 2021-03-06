import { Component, OnInit, Input, ViewEncapsulation, DoCheck, IterableDiffers, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import { CustomLoadingService } from '../../../../../shared/services/custom-loading.service';
import { UserService } from '../../user.service';
import * as _ from 'lodash';
import { DocumentFormsDialogComponent } from './forms-dialog/forms-dialog.component';
import { TabService } from '../../../../tab/tab.service';
import { Subscription } from 'rxjs/Subscription';
import { ConnectorService } from '../../../../../shared/services/connector.service';
import { TabComponent } from '../../../../tab/tab/tab.component';
import { SCMessageService } from '../../../../../shared/services/sc-message.service';
import {FuseConfirmYesNoDialogComponent} from '../../../../../core/components/confirm-yes-no-dialog/confirm-yes-no-dialog.component';

const PROFILE_DOCUMENT = 'profile_document';

@Component({
  selector: 'app-users-profile-document',
  templateUrl: './document.component.html',
  styleUrls: ['./document.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class UsersProfileDocumentComponent implements OnInit, DoCheck, OnDestroy {

  @Input('userInfo') user;
  @Input() currentUser;
  @Input() settings: any = {};

  documents: any[];
  basicDocuments: any[];
  adminDocuments: any[];
  differ: any;
  forms: any[] = [];

  dialogRef: any;
  formEventSubscription: Subscription;

  constructor(
    private spinner: CustomLoadingService,
    private dialog: MatDialog,
    private userService: UserService,
    private toastr: ToastrService,
    private tabService: TabService,
    private connectorService: ConnectorService,
    private scMessageService: SCMessageService,
    differs: IterableDiffers
  ) {
    this.differ = differs.find([]).create(null);
  }

  ngOnInit() {
    this.formEventSubscription = this.connectorService.currentFormTab$.subscribe((tab: TabComponent) => {
      if (tab && tab.url === `profile/${this.user.id}/document/${tab.data.other_id}`) {
        this.getDocuments();
        this.tabService.closeTab(tab.url);
      }
    })
    this.getDocuments();
    if (this.isAdmin || this.isOwner) {
      this.getForms();
    }
  }

  ngOnDestroy() {
    this.formEventSubscription.unsubscribe();
  }

  ngDoCheck() {
    const change = this.differ.diff(this.documents);
    if (change) {
      this.basicDocuments = this.documents.filter(photo => photo.admin_only != 1);
      this.adminDocuments = this.documents.filter(photo => photo.admin_only == 1);
    }
  }

  async getForms() {
    try {
      this.forms = await this.userService.getForms();
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

  private getDocuments() {
    this.userService.getProfileDocuments(this.user.id)
      .subscribe(res => {
        this.documents = res;
        this.basicDocuments = this.documents.filter(document => document.admin_only != 1);
        this.adminDocuments = this.documents.filter(document => document.admin_only == 1);
      }, err => {
        console.log(err);
      });
  }

  async setAsForm(document, formId) {
    try {
      const res = await this.userService.linkDocumentToForm(document.id, formId);
      this.toastr.success(res.message);
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

  openFormModal() {
    this.dialogRef = this.dialog.open(DocumentFormsDialogComponent, {
      disableClose: false,
      panelClass: 'document-form-dialog',
      data: {
        userId: this.user.id
      }
    });
    this.dialogRef.afterClosed().subscribe(_ => {});
  }

  onLockedChanged(document) {
    const lock = document.locked ? 0 : 1;
    this.userService.lockProfileDocument(document.id, lock)
      .subscribe(res => {
        document.locked = document.locked ? 0 : 1;
      }, err => {
        console.log(err);
      });
  }

  async onUploadDocument(event, isAdmin = 0) {
    const files = event.target.files;
    if (files && files.length > 0) {
      this.spinner.show();

      let formData = new FormData();

      for (let i = 0; i < files.length; i++) {
        formData.append('document[]', files[i], files[i].name);
      }

      if (isAdmin) {
        formData.append('adminOnly', '1');
      }

      try {
        const res = await this.userService.uploadProfileDocument(this.user.id, formData).toPromise();
        //this.toastr.success(res.message);
        res.data.map(document => {
          this.documents.push(document);
        });
      } catch (e) {
        _.forEach(e.error.errors, errors => {
          _.forEach(errors, (error: string) => {
            const message = _.replace(error, /document\.\d+/g, 'document');
            this.toastr.error(message);
          });
        });
      } finally {
        this.spinner.hide();
      }
    }
  }

  deleteProfileDocument(document) {
    const dialogRef = this.dialog.open(FuseConfirmYesNoDialogComponent, {
      disableClose: false
    });
    dialogRef.componentInstance.confirmMessage = 'Really delete this?';
    dialogRef.afterClosed().subscribe(async result => {
      if (!result) { return; }
      try {
        await this.userService.deleteProfileFile(document.id, PROFILE_DOCUMENT).toPromise();
        const index = this.documents.findIndex(v => v.id == document.id);
        this.documents.splice(index, 1);
      } catch (e) {
        this.scMessageService.error(e);
      }
    });
  }

  onDrop(event) {
    const document = event.value;
    const isDroppedInAdmin = (this.adminDocuments.findIndex(v => v.id == document.id) > -1) && (document.admin_only != 1);
    const isDroppedInBasic = (this.basicDocuments.findIndex(v => v.id == document.id) > -1) && (document.admin_only == 1);

    if (isDroppedInAdmin || isDroppedInBasic) {
      const adminOnly = isDroppedInAdmin ? 1 : 0;
      this.userService.setProfileDocumentAsAdmin(document.id, adminOnly)
        .subscribe(res => {
          document.admin_only = adminOnly;
        }, err => {
          console.log(err);
        });
    }
  }

  get isOwner() {
    return this.currentUser.lvl === 'owner';
  }

  get isAdmin() {
    return this.currentUser.lvl === 'admin';
  }

}

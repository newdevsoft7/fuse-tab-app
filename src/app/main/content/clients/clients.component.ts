import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatSidenav, MatDialog } from "@angular/material";
import { ClientsService } from "./clients.service";
import { CustomLoadingService } from "../../../shared/services/custom-loading.service";
import { ToastrService } from "ngx-toastr";
import { ClientFormDialogComponent } from "./dialogs/client-form/client-form.component";

import * as _ from 'lodash';
import { UserService } from "../users/user.service";
import { TokenStorage } from "../../../shared/services/token-storage.service";
import { FormGroup, FormBuilder, Validators } from "@angular/forms";
import { FuseConfirmDialogComponent } from "../../../core/components/confirm-dialog/confirm-dialog.component";
import { FilterService } from '@shared/services/filter.service';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit, AfterViewInit {

  clients: any = [];
  selectedClient: any;
  dialogRef: any;
  clientInfo: any = {};

  post: any = {};
  adminNotes: any[] = [];
  noteTemp: any;
  adminNoteForm: FormGroup;
  canSavePost = false;

  @ViewChild('sidenav') private sidenav: MatSidenav;
  @ViewChild('adminNoteInput') adminNoteInput;
  
  constructor(
    private dialog: MatDialog,
    private spinner: CustomLoadingService,
    private toastr: ToastrService,
    private userService: UserService,
    private tokenStorage: TokenStorage,
    private clientsService: ClientsService,
    private formBuilder: FormBuilder,
    private filterService: FilterService
  ) {}

  ngOnInit() {
    this.init();

    this.adminNoteForm = this.formBuilder.group({
      note: ['', Validators.required]
    });

    this.adminNoteForm.valueChanges.subscribe(() => {
      const note = this.adminNoteForm.getRawValue().note;
      if (note.length > 0) {
        this.canSavePost = true;
      } else {
        this.canSavePost = false;
      }
    });
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
        this.sidenav.open();
    }, 200);
  }

  async init() {
    try {
      this.spinner.show();
      this.clients = await this.clientsService.getClients(); 
    } catch (e) {
      this.handleError(e);
    } finally {
      this.spinner.hide();
    }
  }

  changeClient(client: any) {
    this.selectedClient = null;
    setTimeout(async () => {
      this.selectedClient = client;
      try {
        this.spinner.show();
        this.clientInfo = await this.clientsService.getClient(this.selectedClient.id);
        this.adminNotes = await this.clientsService.getAdminNotes(this.selectedClient.id);
        this.adminNoteForm.reset({ note: ''});
      } catch (e) {
        this.handleError(e);
      } finally {
        this.spinner.hide();
      }
    });
  }

  openForm() {
    this.dialogRef = this.dialog.open(ClientFormDialogComponent, {
      panelClass: 'form-dialog',
    });

    this.dialogRef.afterClosed()
        .subscribe(async (client) => {
            if (!client) {
                return;
            }
            try {
              this.spinner.show();
              const res = await this.clientsService.createClient(client);
              this.clients.push(res.data);
              this.filterService.clean(this.filterService.type.clients);
            } catch (e) {
              this.handleError(e);
            } finally {
              this.spinner.hide();
            }
        });
  }

  async updateData(value, key) {
    const client = _.cloneDeep(this.clientInfo);
    client[key] = value;
    try {
      this.spinner.show();
      await this.clientsService.updateClient(client);
      if (key === 'cname') {
        this.filterService.clean(this.filterService.type.clients);
      }
      this.clientInfo[key] = value;
    } catch (e) {
      this.handleError(e);
    } finally {
      this.spinner.hide();
    }
  }

  async deleteSelectedClient() {
    const dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    dialogRef.componentInstance.confirmMessage = `Really delete ${this.selectedClient.cname}?`;
    dialogRef.afterClosed().subscribe(async (result) => {
      if (result) {
        const id = this.selectedClient.id;
        try {
          const index = this.clients.findIndex(client => client.id === id);
          this.clients.splice(index, 1);
          this.selectedClient = null;
          await this.clientsService.deleteClient(id);
          this.filterService.clean(this.filterService.type.clients);
        } catch (e) {
          this.handleError(e);
        }
      }
    });
  }

  async onPostAdminNote() {
    try {
      const res = await this.clientsService.createAdminNote(this.selectedClient.id, this.adminNoteForm.getRawValue());
      this.adminNotes.unshift(res.data);
      this.adminNoteInput.nativeElement.value = '';
      this.adminNoteInput.nativeElement.focus();
      this.canSavePost = false;
    } catch (e) {
      this.handleError(e);
    }
  }

  async onDeleteAdminNote(note) {
    try {
      await this.clientsService.deleteAdminNote(note.id);
      const index = this.adminNotes.findIndex(v => v.id === note.id);
      this.adminNotes.splice(index, 1);
    } catch (e) {
      this.handleError(e);
    }
  }

  onEditAdminNote(note) {
    note.editMode = true;
    this.noteTemp = _.cloneDeep(note);
  }

  onCancelEditAdminNote(note) {
    note.editMode = false;
  }

  async onUpdateAdminNote(note) {
    try {
      const { data } = await this.clientsService.updateAdminNote(note.id, this.noteTemp.note);
      note.note = this.noteTemp.note;
      note.updated_at = data.updated_at;
      note.editMode = false;
    } catch (e) {
      this.handleError(e);
    }
  }

  handleError(e) {
    const errors = e.error.errors;
    if (errors) {
      Object.keys(e.error.errors).forEach(key => this.toastr.error(errors[key]));
    }
    else {
      this.toastr.error(e.error.message);
    }
  }
}

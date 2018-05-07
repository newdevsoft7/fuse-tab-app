import { Component, OnInit, AfterViewInit, ViewChild } from "@angular/core";
import { MatSidenav, MatDialog } from "@angular/material";
import { ClientsService } from "./clients.service";
import { CustomLoadingService } from "../../../shared/services/custom-loading.service";
import { ToastrService } from "ngx-toastr";
import { ClientFormDialogComponent } from "./dialogs/client-form/client-form.component";

import * as _ from 'lodash';
import { UserService } from "../users/user.service";
import { TokenStorage } from "../../../shared/services/token-storage.service";

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

  @ViewChild('sidenav') private sidenav: MatSidenav;

  constructor(
    private dialog: MatDialog,
    private spinner: CustomLoadingService,
    private toastr: ToastrService,
    private userService: UserService,
    private tokenStorage: TokenStorage,
    private clientsService: ClientsService) {}

  ngOnInit() {
    this.init();
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

  async changeClient(client: any) {
    this.selectedClient = client;
    try {
      this.spinner.show();
      this.clientInfo = await this.clientsService.getClient(this.selectedClient.id);
    } catch (e) {
      this.handleError(e);
    } finally {
      this.spinner.hide();
    }
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
              this.toastr.success('Client has been created successfully!');
              this.clients.push(res.data);
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
      this.clientInfo[key] = value;
    } catch (e) {
      this.handleError(e);
    } finally {
      this.spinner.hide();
    }
  }

  async deleteSelectedClient() {
    const id = this.selectedClient.id;
    try {
      const index = this.clients.findIndex(client => client.id === id);
      this.clients.splice(index, 1);
      this.selectedClient = null;
      await this.clientsService.deleteClient(id);
    } catch (e) {
      this.handleError(e);
    }
  }

  async onPostAdminNote() {
    try {
      this.spinner.show();
      await this.userService.createAdminNote(this.tokenStorage.getUser().id, this.post).toPromise();
    } catch (e) {
      this.handleError(e);
    } finally {
      this.spinner.hide();
    }
  }

  handleError(e) {
    this.toastr.error(e.error.message);
  }
}

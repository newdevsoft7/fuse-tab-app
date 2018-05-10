import { Component, ViewChild } from "@angular/core";
import { MatSidenav, MatDialog } from "@angular/material";
import { CustomLoadingService } from "../../../shared/services/custom-loading.service";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../users/user.service";
import { TokenStorage } from "../../../shared/services/token-storage.service";
import { OutsourceCompaniesService } from "./outsource-companies.service";
import { OutsourceCompanyFormComponent } from "./dialogs/outsource-company-form/outsource-company-form.component";

import * as _ from 'lodash';

@Component({
  selector: 'app-outsource-companies',
  templateUrl: './outsource-companies.component.html',
  styleUrls: ['./outsource-companies.component.scss']
})
export class OutsourceCompaniesComponent {
  companies: any = [];
  selectedCompany: any;
  dialogRef: any;
  companyInfo: any = {};

  post: any = {};

  @ViewChild('sidenav') private sidenav: MatSidenav;

  constructor(
    private dialog: MatDialog,
    private spinner: CustomLoadingService,
    private toastr: ToastrService,
    private userService: UserService,
    private tokenStorage: TokenStorage,
    private outsourceCompaniesService: OutsourceCompaniesService) {}

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
      this.companies = await this.outsourceCompaniesService.getAll(); 
    } catch (e) {
      this.handleError(e);
    } finally {
      this.spinner.hide();
    }
  }

  async changeCompany(company: any) {
    this.selectedCompany = company;
    try {
      this.spinner.show();
      this.companyInfo = await this.outsourceCompaniesService.getCompany(this.selectedCompany.id);
    } catch (e) {
      this.handleError(e);
    } finally {
      this.spinner.hide();
    }
  }

  openForm() {
    this.dialogRef = this.dialog.open(OutsourceCompanyFormComponent, {
      panelClass: 'form-dialog',
    });

    this.dialogRef.afterClosed()
        .subscribe(async (company) => {
            if (!company) {
                return;
            }
            try {
              this.spinner.show();
              const res = await this.outsourceCompaniesService.createCompany(company);
              this.toastr.success('Outsource Company has been created successfully!');
              this.companies.push(res.data);
            } catch (e) {
              this.handleError(e);
            } finally {
              this.spinner.hide();
            }
        });
  }

  async updateData(value, key) {
    const company = _.cloneDeep(this.companyInfo);
    company[key] = value;
    try {
      this.spinner.show();
      await this.outsourceCompaniesService.updateCompany(company);
      this.companyInfo[key] = value;
    } catch (e) {
      this.handleError(e);
    } finally {
      this.spinner.hide();
    }
  }

  async deleteSelectedCompany() {
    const id = this.selectedCompany.id;
    try {
      const index = this.companies.findIndex(company => company.id === id);
      this.companies.splice(index, 1);
      this.selectedCompany = null;
      await this.outsourceCompaniesService.deleteCompany(id);
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

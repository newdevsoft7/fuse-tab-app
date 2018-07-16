import { Component, ViewChild } from "@angular/core";
import { MatSidenav, MatDialog } from "@angular/material";
import { CustomLoadingService } from "../../../shared/services/custom-loading.service";
import { ToastrService } from "ngx-toastr";
import { UserService } from "../users/user.service";
import { TokenStorage } from "../../../shared/services/token-storage.service";
import { OutsourceCompaniesService } from "./outsource-companies.service";
import { OutsourceCompanyFormComponent } from "./dialogs/outsource-company-form/outsource-company-form.component";

import * as _ from 'lodash';
import { FormBuilder, FormGroup, Validators } from "@angular/forms";

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
    private outsourceCompaniesService: OutsourceCompaniesService,
    private formBuilder: FormBuilder
  ) { }

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
      this.companies = await this.outsourceCompaniesService.getAll();
    } catch (e) {
      this.handleError(e);
    } finally {
      this.spinner.hide();
    }
  }

  changeCompany(company: any) {
    this.selectedCompany = null;
    setTimeout(async () => {
      this.selectedCompany = company;
      try {
        this.spinner.show();
        this.companyInfo = await this.outsourceCompaniesService.getCompany(this.selectedCompany.id);
        this.adminNotes = await this.outsourceCompaniesService.getAdminNotes(this.selectedCompany.id);
        this.adminNoteForm.reset({ note: ''});
      } catch (e) {
        this.handleError(e);
      } finally {
        this.spinner.hide();
      }
    });
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
          //this.toastr.success('Outsource Company has been created successfully!');
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
      const res = await this.outsourceCompaniesService.createAdminNote(this.selectedCompany.id, this.adminNoteForm.getRawValue());
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
      await this.outsourceCompaniesService.deleteAdminNote(note.id);
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
      const { data } = await this.outsourceCompaniesService.updateAdminNote(note.id, this.noteTemp.note);
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

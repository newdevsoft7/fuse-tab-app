import { Component, OnInit, Input, Output, EventEmitter } from "@angular/core";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-users-settings-staff-outsource',
  templateUrl: './staff-outsource.component.html',
  styleUrls: ['./staff-outsource.component.scss']
})
export class UsersSettingsStaffOutsourceComponent implements OnInit {

  @Input() isWorkHere: boolean;
  @Input() companies: any;
  @Input() companySource: any;

  @Output() filterCompany: EventEmitter<string> = new EventEmitter();
  @Output() addCompany: EventEmitter<any> = new EventEmitter();
  @Output() removeCompany: EventEmitter<any> = new EventEmitter();
  @Output() toggleWorkHere: EventEmitter<boolean> = new EventEmitter();

  selectedCompany: any;

  constructor(
    private toastr: ToastrService
  ) {}

  ngOnInit() {

  }

  checkValue(value: any): void {
    if (typeof value === 'object') {
      this.selectedCompany = value;
    } else {
      this.selectedCompany = null;
    }
  }

  add(company: any): void {
    const index = this.companies.findIndex(comp => comp.id === company.id);
    if (index === -1) {
      this.companies.push(company);
      this.addCompany.next(company);
    } else {
      this.toastr.error('This company already exists');
    }
  }

  remove(company: any): void {
    const index = this.companies.findIndex(comp => comp.id === company.id);
    if (index > -1) {
      this.companies.splice(index, 1);
      this.removeCompany.next(company);
    } else {
      this.toastr.error('This company does not exist');
    }
  }

  companyDisplayFn(company?: any): string {
    return company ? company.cname : '';
  }
}

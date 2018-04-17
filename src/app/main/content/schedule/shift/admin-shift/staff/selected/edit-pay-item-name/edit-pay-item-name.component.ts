import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ScheduleService } from '../../../../../schedule.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-shift-edit-pay-item-name',
  templateUrl: './edit-pay-item-name.component.html',
  styleUrls: ['./edit-pay-item-name.component.scss']
})
export class EditPayItemNameComponent implements OnInit {

  @Input() editable;
  @Input() staff;
  @Input() payItem;

  formActive = false;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private scheduleService: ScheduleService,
    private toastr: ToastrService
  ) { }

  ngOnInit() { }

  openForm() {
    this.form = this.formBuilder.group({
      item_name: this.payItem.item_name
    });
    this.formActive = true;
  }

  async saveForm() {
    if (this.form.valid) {
      const body = this.form.getRawValue();
      try {
        const res = await this.scheduleService.updateRoleStaffPayItem(this.staff.id, this.payItem.id, body);
        this.payItem.item_name = res.data.item_name;
        this.formActive = false;
        this.toastr.success(res.message);
      } catch (e) { 
        this.formActive = false;
      }
    }
  }

  closeForm() {
    this.formActive = false;
  }

}

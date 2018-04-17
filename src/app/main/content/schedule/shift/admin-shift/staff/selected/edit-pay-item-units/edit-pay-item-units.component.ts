import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ScheduleService } from '../../../../../schedule.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-admin-shift-edit-pay-item-units',
  templateUrl: './edit-pay-item-units.component.html',
  styleUrls: ['./edit-pay-item-units.component.scss']
})
export class EditPayItemUnitsComponent implements OnInit {

  @Input() editable;
  @Input() staff;
  @Input() payItem;
  @Output() onItemChanged = new EventEmitter();

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
      units: this.payItem.units
    });
    this.formActive = true;
  }

  async saveForm() {
    if (this.form.valid) {
      const body = this.form.getRawValue();
      try {
        const res = await this.scheduleService.updateRoleStaffPayItem(this.staff.id, this.payItem.id, body);
        this.payItem.units = res.data.units;
        this.formActive = false;
        this.toastr.success(res.message);
        this.onItemChanged.next(true);
      } catch (e) {
        this.formActive = false;
      }
    }
  }

  closeForm() {
    this.formActive = false;
  }
}

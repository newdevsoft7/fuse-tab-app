import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ScheduleService } from '../../../../schedule.service';

@Component({
  selector: 'app-admin-shift-edit-bill-item-units',
  templateUrl: './edit-item-units.component.html',
  styleUrls: ['./edit-item-units.component.scss']
})
export class EditBillItemUnitsComponent implements OnInit {

  @Input() item;
  @Output() onChanged = new EventEmitter();

  formActive = false;
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() { }

  openForm() {
    this.form = this.formBuilder.group({
      bill_units: this.item.bill_units
    });
    this.formActive = true;
  }

  saveForm() {
    if (this.form.valid) {
      this.onChanged.next(this.form.getRawValue().bill_units);
      this.formActive = false;
    }
  }

  closeForm() {
    this.formActive = false;
  }
}

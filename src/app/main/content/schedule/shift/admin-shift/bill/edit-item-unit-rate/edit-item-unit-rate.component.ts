import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-shift-edit-bill-item-unit-rate',
  templateUrl: './edit-item-unit-rate.component.html',
  styleUrls: ['./edit-item-unit-rate.component.scss']
})
export class EditBillItemUnitRateComponent implements OnInit {

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
      bill_unit_rate: this.item.bill_unit_rate
    });
    this.formActive = true;
  }

  saveForm() {
    if (this.form.valid) {
      this.onChanged.next(this.form.getRawValue().bill_unit_rate);
      this.formActive = false;
    }
  }

  closeForm() {
    this.formActive = false;
  }

}

import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-shift-edit-bill-item-rate-type',
  templateUrl: './edit-item-rate-type.component.html',
  styleUrls: ['./edit-item-rate-type.component.scss']
})
export class EditBillItemRateTypeComponent implements OnInit {

  @Input() item;
  @Output() onChanged = new EventEmitter();

  formActive = false;
  form: FormGroup;

  readonly types: any = {
    phr: '/hr',
    flat: 'flat'
  };

  constructor(
    private formBuilder: FormBuilder
  ) { }

  ngOnInit() { }

  openForm() {
    this.form = this.formBuilder.group({
      bill_rate_type: this.item.bill_rate_type
    });
    this.formActive = true;
  }

  saveForm() {
    if (this.form.valid) {
      this.onChanged.next(this.form.getRawValue().bill_rate_type);
      this.formActive = false;
    }
  }

  closeForm() {
    this.formActive = false;
  }

}

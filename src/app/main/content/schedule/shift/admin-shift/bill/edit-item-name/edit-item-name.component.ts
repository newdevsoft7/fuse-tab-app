import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-admin-shift-edit-bill-item-name',
  templateUrl: './edit-item-name.component.html',
  styleUrls: ['./edit-item-name.component.scss']
})
export class EditBillItemNameComponent implements OnInit {

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
      item_name: this.item.title
    });
    this.formActive = true;
  }

  saveForm() {
    if (this.form.valid) {
      this.onChanged.next(this.form.getRawValue().item_name);
      this.formActive = false;
    }
  }

  closeForm() {
    this.formActive = false;
  }

}

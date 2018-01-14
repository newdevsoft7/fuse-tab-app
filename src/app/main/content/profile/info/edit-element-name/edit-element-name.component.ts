import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile-info-edit-element-name',
  templateUrl: './edit-element-name.component.html',
  styleUrls: ['./edit-element-name.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProfileInfoEditElementNameComponent implements OnInit {

  formActive = false;
  form: FormGroup;
  @Input() element;
  @ViewChild('nameInput') nameInputField;

  constructor(private formBuilder: FormBuilder) { }

  ngOnInit() {
  }

  openForm() {
    this.form = this.formBuilder.group({
      ename: [this.element.ename]
    });
    this.formActive = true;
    this.focusNameField();
  }

  closeForm() {
    this.formActive = false;
  }

  focusNameField() {
    setTimeout(() => {
      this.nameInputField.nativeElement.focus();
    });
  }

  onFormSubmit() {
    if (this.form.valid) {
      this.element.ename = this.form.getRawValue().ename;
      this.formActive = false;
    }
  }
}

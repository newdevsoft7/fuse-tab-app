import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
    selector: 'app-profile-info-element-dialog',
    templateUrl: './element.component.html',
    styleUrls: ['./element.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ProfileInfoElementDialogComponent implements OnInit {
    form: FormGroup;
    @ViewChild('nameInput') nameInputField;

    TYPE: any[] = [
        { value: 'short', label: 'Short(40 chars)' },
        { value: 'medium', label: 'Medium(200 chars)' },
        { value: 'long', label: 'Long' },
        { value: 'list', label: 'List(single)' },
        { value: 'listm', label: 'List(multiple)' },
        { value: 'date', label: 'Date' },
        { value: 'number', label: 'Number' },
    ];

    VISIBILITY: any[] = [
        { value: 'hidden', label: 'Hidden' },
        { value: 'required', label: 'Required' },
        { value: 'pay', label: 'Required for invoice' },
        { value: 'optional', label: 'Optional' },
    ];

    constructor(
        public dialogRef: MatDialogRef<ProfileInfoElementDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        public dialog: MatDialog,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            ename: ['', Validators.required],
            etype: ['', Validators.required],
            visibility: ['', Validators.required],
        });
        this.focusNameField();
    }
    
    focusNameField() {
        setTimeout(() => {
            this.nameInputField.nativeElement.focus();
        });
    }

    onSave() {
        this.dialogRef.close(this.form.value);
    }
    onFormSubmit(){
        
    }
}

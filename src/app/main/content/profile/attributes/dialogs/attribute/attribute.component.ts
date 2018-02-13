import { Component, Inject, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatMenuTrigger } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PROFILE_ATTRIBUTE_ROLE, PROFILE_ATTRIBUTE_VISIBILITY } from '../../profile-attribute.models';

@Component({
    selector: 'app-profile-attributes-attribute-dialog',
    templateUrl: './attribute.component.html',
    styleUrls: ['./attribute.component.scss'],
    encapsulation: ViewEncapsulation.None
})

export class ProfileAttributesAttributeDialogComponent implements OnInit {
    form: FormGroup;
    @ViewChild('nameInput') nameInputField;

    ROLE = PROFILE_ATTRIBUTE_ROLE;
    VISIBILITY = PROFILE_ATTRIBUTE_VISIBILITY;

    constructor(
        public dialogRef: MatDialogRef<ProfileAttributesAttributeDialogComponent>,
        @Inject(MAT_DIALOG_DATA) private data: any,
        public dialog: MatDialog,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            aname: ['', Validators.required],
            visibility: ['', Validators.required],
            role_default: [''],            
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

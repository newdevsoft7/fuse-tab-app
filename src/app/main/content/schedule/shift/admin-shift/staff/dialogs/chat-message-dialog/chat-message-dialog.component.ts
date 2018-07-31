import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
    selector: 'app-chat-message-dialog',
    templateUrl: './chat-message-dialog.component.html',
    styleUrls: ['./chat-message-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class ChatMessageDialogComponent implements OnInit {

    form: FormGroup;

    constructor(
        public dialogRef: MatDialogRef<ChatMessageDialogComponent>,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            content: ['', Validators.required]
        });
    }

    send() {
        this.dialogRef.close(this.form.value.content);
    }

}

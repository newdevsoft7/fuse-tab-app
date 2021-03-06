import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { SettingsService } from '../../settings.service';
import { SCMessageService } from '../../../../../shared/services/sc-message.service';

enum Setting {
    xero_key = 102,
    xero_secret = 103
}

@Component({
    selector: 'app-settings-xero-add-key-secret-dialog',
    templateUrl: './add-key-secret-dialog.component.html',
    styleUrls: ['./add-key-secret-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsXeroAddKeySecretDialogComponent implements OnInit {

    form: FormGroup;

    constructor(
        private settingsService: SettingsService,
        private formBuilder: FormBuilder,
        public dialogRef: MatDialogRef<SettingsXeroAddKeySecretDialogComponent>,
        private scMessageService: SCMessageService    
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            key: ['', Validators.required],
            secret: ['', Validators.required]
        });
    }

    async save() {
        if (this.form.valid) {
            try {
                const { key, secret } = this.form.value;
                await this.settingsService.setSetting(Setting.xero_key, key).toPromise();
                await this.settingsService.setSetting(Setting.xero_secret, secret).toPromise();
                this.dialogRef.close(true);
            } catch (e) {
                this.scMessageService.error(e);
            }
        }
    }

}

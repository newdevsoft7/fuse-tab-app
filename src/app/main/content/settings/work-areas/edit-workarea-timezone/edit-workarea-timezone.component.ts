import { Component, EventEmitter, Input, OnInit, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import * as _ from 'lodash';
import { SettingsService } from '../../settings.service';

@Component({
    selector: 'app-settings-work-areas-edit-timezone',
    templateUrl: './edit-workarea-timezone.component.html',
    styleUrls: ['./edit-workarea-timezone.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class SettingsWorkAreasEditTimezoneComponent implements OnInit {

    loadingIndicator: boolean = false;
    //timezones:any[];
    formActive = false;
    form: FormGroup;
    @Input() element;
    @Input() timezones;
    constructor(
        private formBuilder: FormBuilder,
        private settingsService: SettingsService) { }

    ngOnInit() {
        //this.getTimezones();
    }


    openForm() {
        this.form = this.formBuilder.group({
            php_tz: [this.element.php_tz]
        });
        this.formActive = true;
    }

    closeForm() {
        this.formActive = false;
    }

    get timezonename() {
        if ( !this.timezones ) return ' ';
        return this.timezones.find(t => t.id == this.element.php_tz) ? 
                this.timezones.find(t => t.id == this.element.php_tz).name : ' ...';
    }


    onFormSubmit() {
        if (this.form.valid) {
            const newElement = _.cloneDeep(this.element);
            newElement.php_tz = this.form.getRawValue().php_tz;
            this.settingsService.updateWorkArea(newElement.id, newElement)
                .subscribe(res => {
                    this.element.php_tz = newElement.php_tz; 
                });
            this.formActive = false;
        }
    }
}

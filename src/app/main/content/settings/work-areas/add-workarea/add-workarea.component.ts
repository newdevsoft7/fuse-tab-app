import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../../settings.service';


@Component({
    selector: 'app-settings-work-areas-add',
    templateUrl: './add-workarea.component.html',
    styleUrls: ['./add-workarea.component.scss']
})
export class SettingsWorkAreasAddComponent implements OnInit {

    loadingIndicator:boolean = true;
    categories:any[];
    timezones:any[];


    formActive = false;
    form: FormGroup;


    @Output() onWorkAreaAdd = new EventEmitter();
    @ViewChild('nameInput') nameInputField;


    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private settingsService: SettingsService ) {

    }

    ngOnInit() {
        this.getCategories();
        this.getTimeZones();
    }

    private getCategories() {
        this.settingsService.getWorkAreaCategories()
            .subscribe(res => {
                this.loadingIndicator = false;
                this.categories = res;
            }, err => {
                if (err.status && err.status == 403) {
                    this.toastr.error('You have no permission!');
                }
            });
    }

    private getTimeZones(){
        this.settingsService.getTimezones()
            .subscribe(res => {
                this.loadingIndicator = false;
                this.timezones = [];
                Object.keys(res).forEach(key => {
                    this.timezones.push({ id: key, name: res[key] });
                });
            }, err => {
                if (err.status && err.status == 403) {
                    this.toastr.error('You have no permission!');
                }
            });
    }

    openForm() {
        this.form = this.formBuilder.group({
            aname: ['', Validators.required],
            work_area_cat_id: ['', Validators.required],
            php_tz: ['', Validators.required]
        });
        this.formActive = true;
        this.focusNameField();
        this.getCategories();
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
            this.onWorkAreaAdd.next(this.form.value);
            this.formActive = false;
        }
    }

}

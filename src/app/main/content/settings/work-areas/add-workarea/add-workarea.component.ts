import { Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { SettingsService } from '../../settings.service';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';


@Component({
    selector: 'app-settings-work-areas-add',
    templateUrl: './add-workarea.component.html',
    styleUrls: ['./add-workarea.component.scss']
})
export class SettingsWorkAreasAddComponent implements OnInit {

    loadingIndicator:boolean = true;
    categories:any[];
    filteredCategries: Observable<any[]>;

    formActive = false;
    form: FormGroup;
    work_area_cat_id: FormControl;

    @Output() onFieldAdd = new EventEmitter();
    @ViewChild('nameInput') nameInputField;


    constructor(
        private formBuilder: FormBuilder,
        private toastr: ToastrService,
        private settingsService: SettingsService ) {

        this.work_area_cat_id = new FormControl();

    }

    ngOnInit() {
        this.getCategories();
    }
    private getCategories() {
        this.settingsService.getWorkAreaCategories()
            .subscribe(res => {
                this.loadingIndicator = false;
                this.categories = res;

                this.filteredCategries = this.work_area_cat_id.valueChanges
                    .startWith(null)
                    .map(category => category ? this.filterCategries(category) : this.categories.slice());

            }, err => {
                if (err.status && err.status == 403) {
                    this.toastr.error('You have no permission!');
                }
            });
    }

    openForm() {
        this.form = this.formBuilder.group({
            ename: ['', Validators.required],
            work_area_cat_id: ['', Validators.required],
            php_tz: ['', Validators.required]
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
            this.onFieldAdd.next(this.form.value);
            this.formActive = false;
        }
    }

    filterCategries(name: string) {
        return this.categories.filter(category =>
            category.cname.toLowerCase().indexOf(category.cname.toLowerCase()) === 0);
    }  
}

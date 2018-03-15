import {
    Component, OnInit, Input,
    IterableDiffers, SimpleChanges,
    OnChanges, Output, EventEmitter,
    ViewChild, OnDestroy
} from '@angular/core';

import { FormControl, Validators } from '@angular/forms'

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';

import { MatSlideToggleChange, MatSelectChange } from '@angular/material';
import { ToastrService } from 'ngx-toastr';
import * as _ from 'lodash';

import { SettingsService } from '../settings.service';

enum Setting {
    profile_doc_message = 36,
    profile_doc_required = 37
}


@Component({
    selector: 'app-settings-profile-documents',
    templateUrl: './profile-documents.component.html',
    styleUrls: ['./profile-documents.component.scss']
})
export class SettingsProfileDocumentsComponent implements OnInit, OnChanges, OnDestroy {

    _settings = [];

    @Input('settings')
    set settings(settings) {
        this._settings = settings;
    }

    get settings() {
        return this._settings;
    }

    @Input() options = [];

    @Output() settingsChange = new EventEmitter();

    readonly Setting = Setting;

    items: any = {};

    // Form Controls
    docRequired = new FormControl();

    componentDestroyed = new Subject(); // Component Destroy

    constructor(
        private settingsService: SettingsService,
        private toastr: ToastrService
    ) {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.settings) {
            const keys = Object.keys(this.Setting).filter(v => _.isNaN(_.toNumber(v))) as string[];
            _.forEach(keys, (v) => {
                const item = _.find(this.settings, ['setting', v]);
                if (!_.isUndefined(item)) {
                    this.items = { ...this.items, [item.setting]: item.value };
                    if (item.setting === 'profile_doc_required') {
                        this.docRequired.patchValue(this.items.profile_doc_required);
                    }
                }
            });
        }
    }

    ngOnInit() {

        // Number required
        this.docRequired.valueChanges
            .debounceTime(1000)
            .distinctUntilChanged()
            .takeUntil(this.componentDestroyed)
            .subscribe(value => {
                this.onChange(Setting.profile_doc_required, value);
            });
    }

    onChange(id: Setting, event: MatSlideToggleChange | string) {
        if (_.isEmpty(this.settings)) return;

        const setting = _.find(this.settings, ['id', id]);
        let value;

        if (event instanceof MatSlideToggleChange) { // Slide Toggle
            value = event.checked ? 1 : 0;
        } else { // Input Text
            value = event;
        }
        this.settingsService.setSetting(id, value).subscribe(res => {
            setting.value = value;
            this.settingsChange.next(this.settings);
            this.toastr.success(res.message);
        });
    }

    ngOnDestroy() {
        this.componentDestroyed.next();
        this.componentDestroyed.unsubscribe();
    }
}

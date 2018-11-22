import {
    AfterViewInit, Output,
    Component, OnInit,
    ViewChild, forwardRef,
    EventEmitter, Input
} from '@angular/core';

import {
    FormControl, ControlValueAccessor,
    NG_VALUE_ACCESSOR, NG_VALIDATORS
} from '@angular/forms';

import {
    MatAutocompleteSelectedEvent, MatInput,
} from '@angular/material';

import { UP_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';
import { Subject } from 'rxjs/Subject';
import { FilterService } from '@shared/services/filter.service';
import { Observable } from 'rxjs/Observable';
import { ScheduleService } from '@main/content/schedule/schedule.service';

export function arrayDiffObj(s: any[], v: any[], key: string) {
    if (!s) { return []; }
    const reducedIds = v.map(k => k.id);
    return s.filter((obj: any) => reducedIds.indexOf(obj[key]) === -1);
}

const CUSTOM_INPUT_VALIDATORS: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => ShiftRoleRequirementsComponent),
    multi: true
};

const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ShiftRoleRequirementsComponent),
    multi: true
};

@Component({
    selector: 'app-shift-role-requirements',
    templateUrl: './shift-role-requirements.component.html',
    styleUrls: ['./shift-role-requirements.component.scss'],
    providers: [
        CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
    ]
})
export class ShiftRoleRequirementsComponent implements OnInit, AfterViewInit, ControlValueAccessor {

    @ViewChild('chipInput') chipInput: MatInput;

    @Output() valueChange = new EventEmitter();

    @Input('value')
    get value() { return this._value; }
    set value(v: any[]) {
        this._value = v;
        this.onChange(this._value);
    }

    source = [];
    _value = [];

    private searchTerms = new Subject<string>();

    constructor(
        private scheduleService: ScheduleService,
        private filterService: FilterService
    ) {
    }

    ngOnInit() {
        this.getRequirements('');
    }

    ngAfterViewInit() {
        Observable.fromEvent(this.chipInput['nativeElement'], 'keyup')
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe((event: KeyboardEvent) => {
                if (![UP_ARROW, DOWN_ARROW].includes(event.keyCode)) {
                    const value = this.chipInput['nativeElement'].value.toLowerCase();
                    this.getRequirements(value);
                }
            });
    }
    private async getRequirements(query) {
        this.filterService.getRoleRequirementsFilter(query).then(res => this.source = res);
    }

    onChange = (_: any): void => {
        this.valueChange.emit(_);
    }

    onTouched = (_: any): void => {
        // mock
    }

    writeValue(v: any[]): void {
        this._value = v;
    }

    registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
    registerOnTouched(fn: () => void): void { this.onTouched = fn; }

    validate(c: FormControl): any {
        return (this._value) ? undefined : {
            tinyError: {
                valid: false
            }
        };
    }

    add(event: MatAutocompleteSelectedEvent): void {
        const t = event.option.value;

        this._value.push(t);
        this.value = this._value;

        this.chipInput['nativeElement'].value = '';
        this.chipInput['nativeElement'].blur();
        this.getRequirements('');
    }

    addNew(input: MatInput): void {
        this.chipInput['nativeElement'].value = '';
        this.getRequirements('');
    }

    remove(tag): void {
        this._value = this._value.filter(v => v.id !== tag.id);
        this.value = this._value;
        this.chipInput['nativeElement'].blur();
        this.getRequirements('');
    }

    sourceFiltered(groupItems): any[] {
        return arrayDiffObj(groupItems, this._value, 'id');
    }

    displayFn(value: any): string {
        return value && typeof value === 'object' ? value.text : value;
    }

}

import {
    AfterViewInit, Output,
    Component, OnInit,
    ChangeDetectionStrategy,
    ViewChild, forwardRef,
    EventEmitter, Input,
    IterableDiffers, DoCheck
} from '@angular/core';

import {
    FormControl, ControlValueAccessor,
    NG_VALUE_ACCESSOR, NG_VALIDATORS
} from '@angular/forms';

import {
    MatAutocompleteSelectedEvent, MatInput,
    MatDialog
} from '@angular/material';

import { UP_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { ToastrService } from 'ngx-toastr';

import { ScheduleService } from '../../../schedule.service';

export function arrayDiffObj(s: any[], v: any[], key: string) {
    let reducedIds = v;
    return s.filter((obj: any) => reducedIds.indexOf(obj[key]) === -1);
};

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
export class ShiftRoleRequirementsComponent implements OnInit, AfterViewInit, ControlValueAccessor, DoCheck {

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
    
    differ: any;
    
    _selected = [];
    get selected() {
        return this._value.map((v, i) => {
            const idx = this._selected.findIndex(s => s.id === v);
            if (idx > -1) {
                return this._selected[idx];
            } else {
                const idx2 = this.source.findIndex(r => r.id === v);
                this._selected[idx] = idx2 > -1 ? this.source[idx2] : null;
                return this._selected[idx];
            }
        });
    }

    private searchTerms = new Subject<string>();

    constructor(
        private toastr: ToastrService,
        private scheduleService: ScheduleService,
        differs: IterableDiffers
    ) {
        this.differ = differs.find([]).create(null);
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

    ngDoCheck() {
        const change = this.differ.diff(this.source);
        if (change) {
            // TODO
        }
    }

    private getRequirements(query): void {
        this.scheduleService.getRoleRequirements(query)
            .subscribe(res => {
                this.source = res;
            }, err => {
                const errors = err.error.errors;
                Object.keys(errors).forEach(v => {
                    this.toastr.error(errors[v]);
                });
            });
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

        this._value.push(t.id);
        this.value = this._value;

        this._selected.push(t);

        this.chipInput['nativeElement'].value = '';
        this.chipInput['nativeElement'].blur();
        this.getRequirements('');
    }

    addNew(input: MatInput): void {
        this.chipInput['nativeElement'].value = '';
        this.getRequirements('');
    }

    remove(tag): void {
        this._selected = this._selected.filter(t => t.id !== tag.id);
        this._value = this._value.filter(i => i !== tag.id);
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

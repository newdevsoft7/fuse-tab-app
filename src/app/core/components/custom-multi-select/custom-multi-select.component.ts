import { 
    Component,
    Input,
    Output,
    ViewChild,
    forwardRef,
    ChangeDetectionStrategy,
    OnInit,
    EventEmitter,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { MatAutocompleteSelectedEvent, MatInput } from '@angular/material';
import {
    FormControl,
    ControlValueAccessor,
    NG_VALUE_ACCESSOR,
    NG_VALIDATORS
} from '@angular/forms';

import { Observable } from 'rxjs/Rx';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';

import { debounceTime, distinctUntilChanged, switchMap, first } from 'rxjs/operators';
import { UP_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';

export function arrayDiffObj(s: any[], v: any[], key: string) {
    let reducedIds = v;
    return s.filter((obj: any) => reducedIds.indexOf(obj[key]) === -1);
};

const CUSTOM_INPUT_VALIDATORS: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => CustomMultiSelectComponent),
    multi: true
};
const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CustomMultiSelectComponent),
    multi: true
};


@Component({
    selector: 'app-custom-multi-select',
    templateUrl: './custom-multi-select.component.html',
    styleUrls: ['./custom-multi-select.component.scss'],
    providers: [
        CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
    ]
})

export class CustomMultiSelectComponent implements ControlValueAccessor, OnInit, OnChanges {

    @ViewChild('chipInput') chipInput: MatInput;

    @Input() placeholder;
    @Input() labelBy;
    @Input() valueBy;
    @Input() disabled = false;

    source = [];

    @Input() autocompleteObservable: (text: string) => Observable<any>;

    @Output() valueChange = new EventEmitter();

    _value = [];
    
    differ: any;

    _selected = [];
    get selected() {
        return this._value.map((v, i) => {
            const idx = this._selected.findIndex(s => s[this.valueBy] === v);
            if (idx > -1) {
                return this._selected[idx];
            } else {
                const idx2 = this.source.findIndex(r => r[this.valueBy] === v);
                this._selected[idx] = idx2 > -1 ? this.source[idx2] : null;
                return this._selected[idx];
            }
        });
    }

    @Input('value')
    get value() { return this._value; }

    set value(v: any[]) {
        this._value = v;
        this.onChange(this._value);
    }

    constructor() {}

    ngOnChanges(changes: SimpleChanges) {
        if (changes.source && !changes.source.firstChange) {
            this.sourceFiltered();
        }

        if (changes.autocompleteObservable && !changes.autocompleteObservable.firstChange) {
            this.getItemsFromObservable('');
        }
    }

    onChange = (_: any): void => {
        this.valueChange.emit(_);
    }

    onTouched = (_: any): void => {
        // mock
    }

    writeValue(v): void {
        this._value = v;
    }

    ngOnInit() {
        this.getItemsFromObservable('');
    }

    onkeyUpChange(value: string) {
        this.getItemsFromObservable(value);
    }

    sourceFiltered() {
        return arrayDiffObj(this.source, this._value, this.valueBy);
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

        this._value.push(t[this.valueBy]);
        this.value = this._value;

        this._selected.push(t);

        this.chipInput['nativeElement'].value = '';
        this.chipInput['nativeElement'].blur();
        this.getItemsFromObservable('');
    }

    addNew(input: MatInput): void {
        this.chipInput['nativeElement'].value = '';
        this.getItemsFromObservable('');
    }

    remove(tag): void {
        this._selected = this._selected.filter(t => t[this.valueBy] !== tag[this.valueBy]);
        this._value = this._value.filter((i) => i !== tag[this.valueBy]);
        this.value = this._value;
        this.chipInput['nativeElement'].blur();
        this.getItemsFromObservable('');
    }

    private getItemsFromObservable = (text: string): void => {

        const subscribeFn = (data: any[]) => {
            this.source = data;
        };

        this.autocompleteObservable(text)
            .pipe(first())
            .subscribe(subscribeFn);
    }

    displayFn(value: any): string {
        return value && typeof value === 'object' ? value[this.labelBy] : value;
    }

}


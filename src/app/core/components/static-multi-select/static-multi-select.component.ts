import { 
    Component,
    Input,
    Output,
    ViewChild,
    forwardRef,
    ChangeDetectionStrategy,
    AfterViewInit,
    OnInit,
    DoCheck,
    EventEmitter,
    IterableDiffers
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
    useExisting: forwardRef(() => StaticMultiSelectComponent),
    multi: true
};
const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => StaticMultiSelectComponent),
    multi: true
};


@Component({
    selector: 'app-static-multi-select',
    templateUrl: './static-multi-select.component.html',
    styleUrls: ['./static-multi-select.component.scss'],
    providers: [
        CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
    ]
})

export class StaticMultiSelectComponent implements ControlValueAccessor, AfterViewInit, OnInit, DoCheck {

    @ViewChild('chipInput') chipInput: MatInput;

    @Input() placeholder;
    @Input() labelBy;
    @Input() valueBy;
    @Input() disabled = false;

    @Input() source = [];
    filteredSource = [];

    // @Input() autocompleteObservable: (text: string) => Observable<any>;

    @Output() valueChange = new EventEmitter();

    _value = [];
    
    differ: any;

    _selected = [];
    get selected() {
        return this._value.map((v, i) => {
                const idx2 = this.source.findIndex(r => r[this.valueBy] === v);
                return this.source[idx2];
        });
    }

    @Input('value')
    get value() { return this._value; }

    set value(v: any[]) {
        this._value = v;
        this.onChange(this._value);
    }


    constructor(differs: IterableDiffers) {
        this.differ = differs.find([]).create(null);
    }

    ngDoCheck() {
        const change = this.differ.diff(this.source);
        if (change) {
            this.filteredSource = this.source;
            this.sourceFiltered();
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
    }

    ngAfterViewInit() {
        Observable.fromEvent(this.chipInput['nativeElement'], 'keyup')
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe((event: KeyboardEvent) => {
                if (![UP_ARROW, DOWN_ARROW].includes(event.keyCode)) {
                    const value = this.chipInput['nativeElement'].value.toLowerCase();
                    this.filteredSource = this.source.filter(v => v[this.labelBy].toLowerCase().indexOf(value) > -1)
                }
            });
    }

    sourceFiltered() {
        return arrayDiffObj(this.filteredSource, this._value, this.valueBy);
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
    }

    addNew(input: MatInput): void {
        this.chipInput['nativeElement'].value = '';
    }

    remove(tag): void {
        this._selected = this._selected.filter(t => t[this.valueBy] !== tag[this.valueBy]);
        this._value = this._value.filter((i) => i !== tag[this.valueBy]);
        this.value = this._value;
        this.chipInput['nativeElement'].blur();
    }


    displayFn(value: any): string {
        return value && typeof value === 'object' ? value[this.labelBy] : value;
    }

}


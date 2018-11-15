import {
  Component, Input, Output,
  ViewChild, forwardRef,
  OnInit, EventEmitter, OnChanges,
  SimpleChanges
} from '@angular/core';
import { MatAutocompleteSelectedEvent, MatInput } from '@angular/material';
import {
  FormControl,
  ControlValueAccessor,
  NG_VALUE_ACCESSOR,
  NG_VALIDATORS
} from '@angular/forms';


import { first } from 'rxjs/operators';
import { Observable } from 'rxjs/Observable';

export function arrayDiffObj(s: any[] | any, v: any[], key: string) {
  if (!s) { return []; }
  s = Array.isArray(s) ? s : [s];
  const reducedIds = v.map(k => k.id);
  return s.filter((obj: any) => reducedIds.indexOf(obj[key]) === -1);
}

const CUSTOM_INPUT_VALIDATORS: any = {
  provide: NG_VALIDATORS,
  useExisting: forwardRef(() => CustomMultiSelectGroupComponent),
  multi: true
};
const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CustomMultiSelectGroupComponent),
  multi: true
};


@Component({
  selector: 'app-custom-multi-select-group',
  templateUrl: './custom-multi-select-group.component.html',
  styleUrls: ['./custom-multi-select-group.component.scss'],
  providers: [
    CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
  ]
})

export class CustomMultiSelectGroupComponent implements ControlValueAccessor, OnInit, OnChanges {

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

  @Input('value')
  get value() { return this._value; }

  set value(v: any[]) {
    this._value = v;
    this.onChange(this._value);
  }

  constructor() {}

  ngOnChanges(changes: SimpleChanges) {
    if (changes.source && !changes.source.firstChange) {
      // this.sourceFiltered([]);
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

  sourceFiltered(groupItems) {
    return arrayDiffObj(groupItems, this._value, this.valueBy);
  }

  isFiltered(tag) {
    return this._value.includes(tag.id);
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
    this.getItemsFromObservable('');
  }

  addNew(input: MatInput): void {
    this.chipInput['nativeElement'].value = '';
    this.getItemsFromObservable('');
  }

  remove(tag): void {
    this._value = this._value.filter((v) => v[this.valueBy] !== tag[this.valueBy]);
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


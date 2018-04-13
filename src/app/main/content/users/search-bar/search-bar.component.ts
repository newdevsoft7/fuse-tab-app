import {
    Component,
    OnInit,
    Input,
    ViewChild,
    forwardRef,
    ChangeDetectionStrategy,
    AfterViewInit,
    Output,
    EventEmitter
} from '@angular/core';

import { MatAutocompleteSelectedEvent, MatInput, MatDialog } from '@angular/material';
import { FormControl, ControlValueAccessor, NG_VALUE_ACCESSOR, NG_VALIDATORS } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { Subject } from 'rxjs/Subject';
import { of } from 'rxjs/observable/of';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { UP_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';

import { ToastrService } from 'ngx-toastr';
import { UserService } from '../user.service';
import { UsersAddFilterDialogComponent } from './add-filter/add-filter.component';

import * as _ from 'lodash';

export interface Tag {
    id: string;
    text: string;
}

export function arrayDiffObj(s: any[], v: any[], key: string) {
    if (!s) { return []; }
    const reducedIds = v;
    return s.filter((obj: any) => reducedIds.indexOf(obj[key]) === -1);
}

const CUSTOM_INPUT_VALIDATORS: any = {
    provide: NG_VALIDATORS,
    useExisting: forwardRef(() => UsersSearchBarComponent),
    multi: true
};
const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => UsersSearchBarComponent),
    multi: true
};

@Component({
    selector: 'app-users-search-bar',
    templateUrl: './search-bar.component.html',
    styleUrls: ['./search-bar.component.scss'],
    providers: [
        CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR
    ]
})
export class UsersSearchBarComponent implements OnInit, AfterViewInit, ControlValueAccessor {

    @ViewChild('chipInput') chipInput: MatInput;

    dialogRef: any;

    source = [];
    _value = [];

    typeFilters: any[] = [];

    @Input() disableTypeFilter = false;
    @Input() selectedTypeFilter = 'utype:=:all'; // All Active Users
    @Output() filterChange = new EventEmitter();
    @Output() typeFilterChange = new EventEmitter();

    private searchTerms = new Subject<string>();

    @Input('filters')
    get value() { return this._value; }
    set value(v: any[]) {
        this._value = v;
        this.filterChange.next(this._value);
    }


    constructor(
        private dialog: MatDialog,
        private toastr: ToastrService,
        private userService: UserService) {
    }

    async ngOnInit() {
        try  {
            this.getFilters();
            this.typeFilters = await this.userService.getUsersTypeFilters();
        } catch (e) { }
    }

    ngAfterViewInit() {
        Observable.fromEvent(this.chipInput['nativeElement'], 'keyup')
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe((event: KeyboardEvent) => {
                if (![UP_ARROW, DOWN_ARROW].includes(event.keyCode)) {
                    this.onSearchChange(this.chipInput['nativeElement'].value.toLowerCase());
                }
            });
    }

    onChange = (_: any): void => {
    }

    onTouched = (_: any): void => {
        // mock
    }

    writeValue(v): void {
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

    private async getFilters(query = '') {
        try {
            this.source = await this.userService.getUsersFilters(query);
        } catch (e) {}
    }

    onSearchChange(query: string) {
        this.getFilters(query);
    }

    add(event: MatAutocompleteSelectedEvent): void {
        const t: Tag = event.option.value;

        this._value.push(t);
        this.value = this._value;

        this.chipInput['nativeElement'].value = '';
        this.chipInput['nativeElement'].blur();
        this.onSearchChange('');
    }

    addNew(input: MatInput): void {
        const inputValue = input.value.trim();
        let searchedTag: Tag;

        this.source.forEach(group => {
            if (group.children.findIndex(o => o.text === inputValue) > -1) {
                searchedTag = group.children.find(o => o.text === inputValue);
                return;
            }
        });

        let newTag: Tag;

        if  (inputValue !== '') {
            if (searchedTag) {
                if (this.value.findIndex(v => v.id === searchedTag.id) < 0) {
                    newTag = { ...searchedTag };
                    this._value.push(newTag.id);
                    this.value = this._value;
                }
            } else {
                if (this.value.findIndex(v => v.id === inputValue) < 0) {
                    newTag = { id: input.value, text: input.value };
                    this._value.push(newTag.id);
                    this.value = this._value;
                }
            }
        }

        this.chipInput['nativeElement'].value = '';
        this.onSearchChange('');
    }

    remove(tag: Tag): void {
        this._value = this._value.filter(v => v.id !== tag.id);
        this.value = this._value;
        this.chipInput['nativeElement'].blur();
        this.onSearchChange('');
    }

    sourceFiltered(groupItems) {
        return arrayDiffObj(groupItems, this._value, 'id');
    }

    displayFn(value: any): string {
        return value && typeof value === 'object' ? value.text : value;
    }

    openFiltersDialog() {
        this.dialogRef = this.dialog.open(UsersAddFilterDialogComponent, {
            panelClass: 'users-filter-dialog',
        });

        this.dialogRef.afterClosed()
            .subscribe(result => {});
    }

    onTypeFilterChange(event) {
        this.typeFilterChange.next(event.value);
    }
}

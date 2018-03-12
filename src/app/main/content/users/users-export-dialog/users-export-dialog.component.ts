import {
    Component, Inject, OnInit,
    ViewEncapsulation, AfterViewInit,
    ViewChild
} from '@angular/core';
import { UP_ARROW, DOWN_ARROW } from '@angular/cdk/keycodes';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatInput, MatAutocompleteSelectedEvent } from '@angular/material';

import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';

import { UserService } from '../user.service';

export interface Tag {
    id: string;
    text: string;
}

function arrayDiffObj(s: any[], v: any[], key: string) {
    if (!s) return [];
    let reducedIds = v.map((o) => o[key]);
    return s.filter((obj: any) => reducedIds.indexOf(obj[key]) === -1);
};

@Component({
    selector: 'app-users-export-dialog',
    templateUrl: './users-export-dialog.component.html',
    styleUrls: ['./users-export-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class UsersExportDialogComponent implements OnInit, AfterViewInit {

    @ViewChild('chipInput') chipInput: MatInput;

    types: any[] = [];
    selectedType = 'utype:=:all';

    source = []; // User Filters
    filters = [];

    constructor(
        public dialogRef: MatDialogRef<UsersExportDialogComponent>,
        private userService: UserService,
        @Inject(MAT_DIALOG_DATA) private data: any
    ) { }

    ngOnInit() {
        this.init();
        this.getFilters();
    }

    ngAfterViewInit() {
        Observable.fromEvent(this.chipInput['nativeElement'], 'keyup')
            .debounceTime(300)
            .distinctUntilChanged()
            .subscribe((event: KeyboardEvent) => {
                if (![UP_ARROW, DOWN_ARROW].includes(event.keyCode)) {
                    this.getFilters(this.chipInput['nativeElement'].value.toLowerCase());
                }
            });
    }

    export() {
        this.dialogRef.close();
    }

    private async init() {
        try {
            this.types = await this.userService.getUsersTypeFilters();
        } catch (e) {
            console.log(e);
        }
    }

    add(event: MatAutocompleteSelectedEvent): void {
        const t: Tag = event.option.value;
        this.filters.push(t);
        this.chipInput['nativeElement'].value = '';
        this.chipInput['nativeElement'].blur();
        this.getFilters('');

    }

    addNew(input: MatInput): void {
        let inputValue = input.value.trim();
        let searchedTag: Tag;

        this.source.forEach(group => {
            if (group.children.findIndex(o => o.text == inputValue) >= 0) {
                searchedTag = group.children.find(o => o.text == inputValue);
                return;
            }
        });

        let newTag: Tag;

        if (inputValue != '') {
            if (searchedTag) {
                if (this.filters.findIndex(v => v.id == searchedTag.id) < 0) {
                    newTag = { ...searchedTag };
                    this.filters.push(newTag);
                }
            } else {
                if (this.filters.findIndex(v => v.id == inputValue) < 0) {
                    newTag = { id: input.value, text: input.value };
                    this.filters.push(newTag);
                }
            }
        }

        this.chipInput['nativeElement'].value = '';
        this.getFilters('');
    }

    remove(tag: Tag): void {
        this.filters = this.filters.filter((i: Tag) => i.id !== tag.id);
        this.filters = this.filters;
        this.chipInput['nativeElement'].blur();
        this.getFilters('');
    }

    sourceFiltered(groupItems: Tag[]): Tag[] {
        return arrayDiffObj(groupItems, this.filters, 'id');
    }

    displayFn(value: any): string {
        return value && typeof value === 'object' ? value.text : value;
    }

    private getFilters(query = '') {
        this.userService.getUsersFilters(query).subscribe(
            res => {
                this.source = [...res];
            },
            err => {
                console.log(err);
            }
        );
    }

}

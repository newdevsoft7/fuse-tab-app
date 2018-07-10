import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { Observable, Subscription } from 'rxjs';
import { FormControl } from '@angular/forms';
import { startWith, map } from 'rxjs/operators';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { MatAutocompleteSelectedEvent } from '@angular/material';

@Component({
    selector: 'app-users-card-select-tag',
    templateUrl: './select-tag.component.html',
    styleUrls: ['./select-tag.component.scss']
})
export class UsersCardSelectTagComponent implements OnInit, OnDestroy, OnChanges {

    @Input() tags: string[] = [];
    @Input() source: string[] = [];
    @Output() onTag = new EventEmitter;
    @Output() onUntag = new EventEmitter;

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    @ViewChild('tagInput') tagInput: ElementRef;
    tagsSubscription: Subscription;
    tagControl = new FormControl();
    filteredTags: string[];

    constructor() { }

    ngOnInit() {
        this.tagsSubscription = this.tagControl.valueChanges
            .startWith(null)
            .debounceTime(300)
            .subscribe((tag: string | null) => {
                if (tag) {
                    this.filteredTags = this.sourceFiltered().filter(s => s.toLowerCase().indexOf(tag.trim().toLowerCase()) > -1);
                } else {
                    this.filteredTags = this.sourceFiltered();
                }
            });
    }

    ngOnDestroy() {
        this.tagsSubscription.unsubscribe();
    }

    ngOnChanges(changes: SimpleChanges) {
        if (changes.tags && changes.tags.currentValue
            && changes.source && changes.source.currentValue) {
                this.filteredTags = this.sourceFiltered();
            }
    }

    remove(tag): void {
        const index = this.tags.indexOf(tag);
        if (index >= 0) {
            this.tags.splice(index, 1);
        }
        this.tagInput.nativeElement.blur();
        this.tagControl.setValue(this.tagInput.nativeElement.value);
        this.onUntag.next(tag);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        const tag = event.option.viewValue;
        this.tags.push(tag);
        this.tagInput.nativeElement.value = '';
        this.tagInput.nativeElement.blur();
        this.tagControl.setValue(null);
        this.onTag.next(tag);
    }

    sourceFiltered() {
        const tags = this.tags.map(v => v.toLowerCase());
        return this.source.filter((s: string) => tags.indexOf(s.toLowerCase()) < 0);
    }
}

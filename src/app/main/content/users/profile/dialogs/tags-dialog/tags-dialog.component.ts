import { Component, OnInit, Inject, ViewEncapsulation, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatAutocompleteSelectedEvent } from '@angular/material';
import { MatChipInputEvent } from '@angular/material';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-users-profile-tags-dialog',
    templateUrl: './tags-dialog.component.html',
    styleUrls: ['./tags-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class TagsDialogComponent implements OnInit, OnDestroy {

    readonly separatorKeysCodes: number[] = [ENTER, COMMA];
    @ViewChild('tagInput') tagInput: ElementRef;
    tagsSubscription: Subscription;
    tagControl = new FormControl();
    tags: string[];
    source: string[];
    filteredTags: string[];

    constructor(
        public dialogRef: MatDialogRef<TagsDialogComponent>,
        @Inject(MAT_DIALOG_DATA) data: any
    ) {
        this.tags = [...data.tags] || [];
        this.source = [...data.source] || [];
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

    ngOnInit() {
    }

    ngOnDestroy() {
        this.tagsSubscription.unsubscribe();
    }

    save() {
        this.dialogRef.close(this.tags);
    }

    add(event: MatChipInputEvent): void {
        const input = event.input;
        const value = event.value;

        if ((value || '').trim()) {
            const index = this.tags.findIndex((t: string) => t.toLowerCase() == value.trim().toLowerCase());
            if (index < 0) {
                this.tags.push(value.trim());
                this.source.push(value.trim());
            }
        }

        if (input) {
            input.value = '';
        }

        this.tagControl.setValue(null);
    }

    remove(tag): void {
        const index = this.tags.indexOf(tag);
        if (index >= 0) {
            this.tags.splice(index, 1);
        }
        this.tagInput.nativeElement.blur();
        this.tagControl.setValue(this.tagInput.nativeElement.value);
    }

    selected(event: MatAutocompleteSelectedEvent): void {
        this.tags.push(event.option.viewValue);
        this.tagInput.nativeElement.value = '';
        this.tagInput.nativeElement.blur();
        this.tagControl.setValue(null);
    }

    sourceFiltered() {
        const tags = this.tags.map(v => v.toLowerCase());
        return this.source.filter((s: string) => tags.indexOf(s.toLowerCase()) < 0);
    }

}

import { Component, OnInit, Input, ViewChild, ViewChildren, QueryList, AfterViewChecked } from '@angular/core';
import { UserService } from '../../user.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { OnRatingChangeEven } from 'angular-star-rating';


@Component({
    selector: 'app-users-profile-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class UsersProfileAboutComponent implements OnInit, AfterViewChecked {

    @Input() userInfo;
    @Input() currentUser;
    @Input() settings: any = {};
    @ViewChild('adminNoteInput') adminNoteInput;
    @ViewChildren('tag') tags: QueryList<any>;
    prevOpenedField: any;
    countries: any[] = [];
    canSavePost = false;

    adminNotes = [];
    adminNoteForm: FormGroup;
    noteTemp: any; // Note template for update

    sex: string;

    readonly noteTypes = [
        { value: 'info', label: 'Info' },
        { value: 'interview', label: 'Interview' },
        { value: 'system', label: 'System' },
        { value: 'positive', label: 'Positive' },
        { value: 'negative', label: 'Negative' }
    ]

    @Input() ratings = [];

    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.adminNoteForm = this.formBuilder.group({
            type: ['info', Validators.required],
            note: ['', Validators.required]
        });

        // Get profile admin notes
        if (['owner', 'admin'].includes(this.currentUser.lvl)) {
            this.userService.getAdminNotes(this.userInfo.id).subscribe(res => {
                this.adminNotes = res;
            });
        }

        this.userService.getCountries().then(countries => this.countries = countries);


        this.adminNoteForm.valueChanges.subscribe(() => {
            this.onAdminNoteFormValuesChanged();
        });

    }

    ngAfterViewChecked() {
        const openedFields = this.tags.filter(v => v.formActive);
        switch (openedFields.length) {
            case 0:
                break;
            case 1:
                setTimeout(() => this.prevOpenedField = openedFields[0]);
                break;
            case 2:
                setTimeout(() => this.prevOpenedField.onFormSubmit());
                break;
        }
    }

    onAdminNoteFormValuesChanged() {
        const note = this.adminNoteForm.getRawValue().note;
        if (note.length > 0) {
            this.canSavePost = true;
        } else {
            this.canSavePost = false;
        }
    }

    getNoteType(noteType) {
        const type = this.noteTypes.find(t => t.value === noteType);
        return type ? type.label : '';
    }

    onPostAdminNote() {
        const data = this.adminNoteForm.value;
        this.canSavePost = false;
        this.userService.createAdminNote(this.userInfo.id, data)
            .subscribe(res => {
                const note = res.data;
                note.creator_ppic_a = this.currentUser.ppic_a;
                note.creator_name = `${this.currentUser.fname} ${this.currentUser.lname}`;

                this.adminNotes.unshift(note);

                this.adminNoteInput.nativeElement.value = '';
                this.adminNoteInput.nativeElement.focus();
            }, err => {
                console.log(err);
            });
    }

    onDeleteAdminNote(note) {
        const index = this.adminNotes.findIndex(v => v.id == note.id);
        this.userService.deleteAdminNote(note.id)
            .subscribe(res => {
                this.adminNotes.splice(index, 1);
            }, err => {
            });
    }

    onEditAdminNote(note) {
        note.editMode = true;
        this.noteTemp = _.cloneDeep(note);
    }

    onCancelEditAdminNote(note) {
        note.editMode = false;
    }

    onUpdateAdminNote(note) {

        // TODO - Update shift admin note
        const index = this.adminNotes.findIndex(v => v.id === note.id);

        // Update note
        this.userService.updateAdminNote(
            note.id,
            {
                note: this.noteTemp.note,
                type: this.noteTemp.type
            }
        ).subscribe(res => {
            note.type = this.noteTemp.type;
            note.note = this.noteTemp.note;
            note.updated_at = res.data.updated_at;
        });
        note.editMode = false;

    }

    changeRate(event: OnRatingChangeEven, rating) {
        const score = event.rating;
        this.userService.setUserRatings(this.currentUser.id, rating.id, score).subscribe(res => {
            const index = _.findIndex(this.ratings, ['id', rating.id]);
            this.ratings[index].score = score;
        });
    }

    resetRate(rating) {
        this.userService.setUserRatings(this.currentUser.id, rating.id, 0).subscribe(res => {
            const index = _.findIndex(this.ratings, ['id', rating.id]);
            this.ratings[index].score = 0;
        });
    }

    updateSex(sex: string) {
        setTimeout(() => {
            this.sex = sex;
        });
    }

}

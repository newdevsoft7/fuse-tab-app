import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserService } from '../../user.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import * as _ from 'lodash';
import { OnRatingChangeEven } from 'angular-star-rating';


@Component({
    selector: 'app-users-profile-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.scss']
})
export class UsersProfileAboutComponent implements OnInit {

    @Input() userInfo;
    @Input() currentUser;
    @ViewChild('adminNoteInput') adminNoteInput;
    
    canSavePost = false;

    adminNotes = [];
    viewedAdminNotes: any[];
    isSeeAllAdminNotes = false;
    adminNoteForm: FormGroup;
    noteTemp: any; // Note template for update

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
                this.refreshAdminNotesView();
            });
        }


        this.adminNoteForm.valueChanges.subscribe(() => {
            this.onAdminNoteFormValuesChanged();
        });
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
    };

    onSeeAllAdminNotes() {
        this.isSeeAllAdminNotes = true;
        this.refreshAdminNotesView();
    }


    onPostAdminNote() {
        const data = this.adminNoteForm.value;
        this.userService.createAdminNote(this.currentUser.id, data)
            .subscribe(res => {
                const note = res.data;
                note.creator_ppic_a = this.userInfo.ppic_a;
                note.creator_name = `${this.userInfo.fname} ${this.userInfo.lname}`;

                
                this.adminNotes.unshift(note);
                this.refreshAdminNotesView();

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
                this.refreshAdminNotesView();
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

    private refreshAdminNotesView() {
        if (this.isSeeAllAdminNotes) {
            this.viewedAdminNotes = this.adminNotes;
        } else {
            this.viewedAdminNotes = this.adminNotes.slice(0, 5);
        }
    }

    changeRate(event: OnRatingChangeEven, rating) {
        const score = event.rating;
        this.userService.setUserRatings(this.currentUser.id, rating.id, score).subscribe(_ => {});
    }

    resetRate(rating) {
        this.userService.setUserRatings(this.currentUser.id, rating.id, 0).subscribe(_ => {});
    }

    
}

import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { UserService } from '../../user.service';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';


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

    adminNotes: any[];
    isSeeAllAdminNotes = false;
    adminNoteForm: FormGroup;

    constructor(
        private userService: UserService,
        private formBuilder: FormBuilder
    ) { }

    ngOnInit() {
        this.adminNoteForm = this.formBuilder.group({
            type: ['info', Validators.required],
            note: ['', Validators.required]
        });

        if (['owner', 'admin'].includes(this.currentUser.lvl)) {
            this.refreshAdminNotesView();
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

    onSeeAllAdminNotes() {
        this.isSeeAllAdminNotes = true;
        this.refreshAdminNotesView();
    }


    onPostAdminNote() {
        const data = this.adminNoteForm.value;
        this.userService.createAdminNote(this.currentUser.id, data)
            .subscribe(res => {
                const note = res.data;
                note.creator_thumbnail = this.userInfo.ppic_a;
                note.creator_name = `${this.userInfo.fname} ${this.userInfo.lname}`;

                
                this.userInfo.profile_admin_notes.unshift(note);
                this.refreshAdminNotesView();

                this.adminNoteInput.nativeElement.value = '';
                this.adminNoteInput.nativeElement.focus();
            }, err => {
                console.log(err);
            });
    }

    onDeleteAdminNote(note) {
        const index = this.userInfo.profile_admin_notes.findIndex(v => v.id == note.id);
        this.userService.deleteAdminNote(note.id)
            .subscribe(res => {
                this.userInfo.profile_admin_notes.splice(index, 1);
                this.refreshAdminNotesView();
            }, err => {

            });      
    }

    private refreshAdminNotesView() {
        if (this.isSeeAllAdminNotes) {
            this.adminNotes = this.userInfo.profile_admin_notes;
        } else {
            this.adminNotes = this.userInfo.profile_admin_notes.slice(0, 5);
        }
    }
}

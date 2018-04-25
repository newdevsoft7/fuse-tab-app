import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-group-attachments',
    templateUrl: './attachments.component.html',
    styleUrls: ['./attachments.component.scss']
})
export class GroupAttachmentsComponent implements OnInit {

    @Input() group;
    @Input() shifts;

    constructor() { }

    ngOnInit() {
    }

}

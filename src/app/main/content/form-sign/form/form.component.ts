import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit {

    iframeUrl: string;
    data: any;

    @Input('data') set updateData(data: any) {
        this.data = data;
        if (this.data && this.data.other_id && !this.data.isEdit) {
            this.iframeUrl = `https://formsigner.net/main/templates/signup/${this.data.other_id}?provider=staffconnect&type=iframe`;
        } else if (this.data && this.data.other_id && this.data.isEdit) {
            this.iframeUrl = `https://formsigner.net/main/templates/edit/${this.data.other_id}?provider=staffconnect&type=iframe`;
        } else if (this.data && !this.data.other_id) {
            this.iframeUrl = `https://formsigner.net/main/templates/create?provider=staffconnect&type=iframe`;
        }
    }

    constructor() { }

    ngOnInit() {}
}

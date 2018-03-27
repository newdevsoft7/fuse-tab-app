import { Component, OnInit } from '@angular/core';
import * as _ from 'lodash';

import { TabService } from '../../tab/tab.service';
import { Tab } from '../../tab/tab';

@Component({
    selector: 'app-form-sign',
    templateUrl: './form-sign.component.html',
    styleUrls: ['./form-sign.component.scss']
})
export class FormSignComponent implements OnInit {

    constructor(
        private tabService: TabService
    ) { }

    ngOnInit() {
    }

    createForm() {
        const tab = new Tab(
            'New Form',
            'formTpl',
            'forms/new',
            {
                url: 'forms',
                source: 'https://formsigner.net/main/templates/create?provider=staffconnect&type=iframe'
            }
        );
        this.tabService.openTab(tab);
    }

    openForm() {
        const tab = new Tab(
            'Form',
            'formTpl',
            'forms/1',
            {
                url: 'forms',
                source: 'https://formsigner.net/main/templates/signup/46?provider=staffconnect&type=iframe'
            }
        );
        this.tabService.openTab(tab);
    }

}

import {
  Component, OnInit, Input,
  Output, EventEmitter
} from '@angular/core';

import { MatSlideToggleChange } from '@angular/material';

import * as _ from 'lodash';

import {SettingsService} from '../settings.service';

enum Setting {
  quiz_enable = 43
}

@Component({
  selector: 'app-settings-quizs',
  templateUrl: './quizs.component.html',
  styleUrls: ['./quizs.component.scss']
})
export class SettingsQuizsComponent implements OnInit {

  @Input() settings = [];
  @Input() options = [];

  @Output() settingsChange = new EventEmitter();

  readonly Setting = Setting;

  constructor(private settingsService: SettingsService) {
  }

  ngOnInit() { }

  value(id: Setting) {
    if (_.isEmpty(this.settings)) {
      return;
    }
    const value = _.find(this.settings, ['id', id]);
    return _.toInteger(value.value) === 0 ? false : true;
  }

  onChange(id: Setting, event: MatSlideToggleChange) {
    if (_.isEmpty(this.settings)) {
      return;
    }
    const setting = _.find(this.settings, ['id', id]);
    const value = event.checked ? 1 : 0;

    this.settingsService.setSetting(id, value).subscribe(res => {
      setting.value = value;
      this.settingsChange.next(this.settings);
      this.settingsService.quizsEnableChanged.next(value);
    });
  }

}

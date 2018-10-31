import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import * as _ from 'lodash';
import { ActivityLogService } from '../activity-log.service';
import { SCMessageService } from '../../../../shared/services/sc-message.service';
import { Tab } from '../../../tab/tab';
import { TabService } from '../../../tab/tab.service';

@Component({
  selector: 'app-activity-log',
  templateUrl: './activity-log.component.html',
  styleUrls: ['./activity-log.component.scss']
})
export class ActivityLogComponent implements OnInit, OnChanges {

  @Input() type: string;
  @Input() id: number;
  @Input() filters: any[] = [];
  @Input() pageSize = 50;
  @Input() render = false;

  pageNumber = 0;
  isFetching = false;
  results: any[] = [];
  chunk: any[] = [];
  total: number;

  constructor(
    private activityLogService: ActivityLogService,
    private scMessageService: SCMessageService,
    private tabService: TabService
  ) { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['render'] && changes['render'].currentValue) {
      this.fetch();
    }
  }

  async fetch() {
    const options = this.makeOptions();
    try {
      this.isFetching = true;
      this.chunk = await this.activityLogService.getActivityLog(this.type, options);
      this.results.push(...this.chunk);
    } catch (e) {
      this.scMessageService.error(e);
    } finally {
      this.isFetching = false;
    }
  }

  loadMore() {
    this.pageNumber = this.pageNumber + 1;
    this.fetch();
  }

  makeOptions() {
    let options: any = {};
    if (this.id !== null) {
      options = { ...options, id: this.id };
    }
    if (this.filters) {
      options = { ...options, filters: this.filters };
    }
    if (this.pageNumber !== null) {
      options = { ...options, pageNumber: this.pageNumber };
    }
    if (this.pageSize !== null) {
      options = { ...options, pageSize: this.pageSize };
    }
    options = _.isEmpty(options) ? null : options;
    return options;
  }

  openUserTab(user) {
    const tab = new Tab(`${user.name}`, 'usersProfileTpl', `users/user/${user.id}`, user);
    this.tabService.openTab(tab);
  }

}



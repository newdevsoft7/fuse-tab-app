import { Component, OnInit, Input, ViewChild, OnDestroy } from '@angular/core';
import {MatDialog, MatTab, MatTabChangeEvent} from '@angular/material';
import { TokenStorage } from '../../../../../shared/services/token-storage.service';
import { ScheduleService } from '../../schedule.service';
import { UserService } from '../../../users/user.service';
import { ToastrService } from 'ngx-toastr';

import * as _ from 'lodash';
import { StaffShiftMapComponent } from './map/map.component';
import { TabService } from '../../../../tab/tab.service';
import { Subscription } from 'rxjs/Subscription';
import { ConnectorService } from '../../../../../shared/services/connector.service';
import { TabComponent } from '../../../../tab/tab/tab.component';
import {NewMessageDialogComponent} from '../../../users/profile/dialogs/new-message-dialog/new-message-dialog.component';
import {Tab} from '../../../../tab/tab';
import {SCMessageService} from '../../../../../shared/services/sc-message.service';
import {UsersChatService} from '../../../users/chat/chat.service';

enum TAB {
  Info = 'Info',
  Map = 'Map',
  Expenses = 'Expenses',
  Reports = 'Reports & Uploads'
}

@Component({
  selector: 'app-staff-shift',
  templateUrl: './staff-shift.component.html',
  styleUrls: ['./staff-shift.component.scss']
})
export class StaffShiftComponent implements OnInit, OnDestroy {

  @Input() data;
  shift: any;
  currentUser: any;
  showMoreBtn = true;
  timezones: any;
  managers = '';
  settings: any;

  formEventSubscription: Subscription;

  @ViewChild('mapTab') mapTab: StaffShiftMapComponent;

  constructor(
    private tokenStorage: TokenStorage,
    private toastr: ToastrService,
    private userService: UserService,
    private scheduleService: ScheduleService,
    private tabService: TabService,
    private connectorService: ConnectorService,
    private scMessageService: SCMessageService,
    private chatService: UsersChatService,
    private dialog: MatDialog
  ) {
    this.settings = this.tokenStorage.getSettings();
  }

  ngOnInit() {
    this.currentUser = this.tokenStorage.getUser();

    this.fetch();

    // Get timezones
    this.scheduleService.getTimezones()
      .subscribe(res => {
        this.timezones = res;
      });

    this.formEventSubscription = this.connectorService.currentFormTab$.subscribe((tab: TabComponent) => {
      if (!tab) { return; }
      const id = tab.data.other_id;
      if (tab && tab.url === `form_apply/${this.shift.id}/${id}`) {
        const index = this.shift.forms_apply.findIndex(form => form.other_id === id);
        if (index > -1) {
          this.shift.forms_apply.splice(index, 1);
        }
        this.tabService.closeTab(tab.url);
      } else if (tab && tab.url === `form_confirm/${this.shift.id}/${id}`) {
        const index = this.shift.forms_confirm.findIndex(form => form.other_id === id);
        if (index > -1) {
          this.shift.forms_confirm.splice(index, 1);
        }
        this.tabService.closeTab(tab.url);
      }
    });
  }

  ngOnDestroy() {
    this.formEventSubscription.unsubscribe();
  }

  // Get a shift
  private async fetch() {
    try {
      this.shift = await this.scheduleService.getShift(this.data.id);
      this.managers = this.shift.managers.map(m => m.name).join(', ')
    } catch (e) {
      this.toastr.error(e.message || 'Something is wrong while fetching events.');
    }
  }

  toggleMoreBtn() {
    this.showMoreBtn = !this.showMoreBtn;
  }

  selectedTabChange(event: MatTabChangeEvent) {
    switch (event.tab.textLabel) {
      case TAB.Map:
        this.mapTab.refreshMap();
        break;

      default:
        break;
    }
  }

  openChat() {
    let dialogRef: any;

    switch (true) {
      case this.shift.thread_id == null:
        this.toastr.error('Chat is not available for this shift.');
        break;
      case this.shift.thread_id == 0:
        dialogRef = this.dialog.open(NewMessageDialogComponent, {
          panelClass: 'new-message-dialog'
        });
        dialogRef.afterClosed().subscribe(async message => {
          if (!message) {
            return;
          }
          try {
            const { thread_id } = await this.chatService.sendMessage({
              shift_id: this.shift.id,
              content: message
            });
            this.openChatTab(thread_id);
          } catch (e) {
            this.scMessageService.error(e);
          }
        });
        break;
      case this.shift.thread_id > 0:
        this.openChatTab(this.shift.thread_id);
        break;
      default:
        break;
    }
  }

  openChatTab(threadId) {
    const tab = new Tab('Chat', 'usersChatTpl', 'users/chat', { threadId });
    this.tabService.openTab(tab);
  }
}

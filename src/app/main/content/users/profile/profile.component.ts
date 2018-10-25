import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { TokenStorage } from '../../../../shared/services/token-storage.service';
import { MatDialog, MatDialogRef, MatTabGroup, MatTab, MatTabChangeEvent } from "@angular/material";
import { FuseConfirmDialogComponent } from "../../../../core/components/confirm-dialog/confirm-dialog.component";
import { UserService } from '../user.service';
import { UsersProfileCardsComponent } from './cards/cards.component';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Router } from '@angular/router';
import { NewMessageDialogComponent } from './dialogs/new-message-dialog/new-message-dialog.component';
import { UsersChatService } from '../chat/chat.service';
import { SCMessageService } from '../../../../shared/services/sc-message.service';


@Component({
  selector: 'app-users-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class UsersProfileComponent implements OnInit {

  @Input('data') user;
  @ViewChild('tabGroup') tabGroup: MatTabGroup;
  @ViewChild('cardsTab') cardsTab: UsersProfileCardsComponent;

  currentUser: any;
  userInfo: any;
  ratings: any = [];

  settings: any = {};
  isApproveRejectShow = false;
  isFavStatusShow = false;
  isSettingsShow = false;
  isSkillsShow = false;
  isCardsShow = false;
  isWorkAreasShow = false;
  timezones: any[] = [];
  selectedIndex: number = 0;

  linkedUsers: any = [];

  dialogRef: MatDialogRef<FuseConfirmDialogComponent>;
  avatarUrl: string;

  constructor(
    private tokenStorage: TokenStorage,
    private userService: UserService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private authService: AuthenticationService,
    private chatService: UsersChatService,
    private scMessageService: SCMessageService,
    private router: Router
  ) { }

  ngOnInit() {
    this.getUserInfo();
    this.getTimezones();
    this.currentUser = this.tokenStorage.getUser();
    this.settings = this.tokenStorage.getSettings();
    this.isWorkAreasShow = this.settings.work_areas_enable
  }

  async toggleFav() {
    const fav = this.userInfo.fav === 1 ? 0 : 1;
    try {
      const res = await this.userService.updateUser(this.userInfo.id, { fav });
      //this.toastr.success(res.message);
      this.userInfo.fav = fav;
    } catch (e) {
      this.toastr.error(e.error.error);
    }
  }

  confirmApprove() {
    this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = 'Really approve this registrant?';
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.approve();
      }
    });
  }

  async approve() {
    try {
      const res = await this.userService.approveRegistrant(this.userInfo.id);
      //this.toastr.success(res.message);
      this.userInfo.lvl = res.lvl;
      this.userInfo.user_status = res.user_status;
      this.isApproveRejectShow = ['registrant'].some(v => res.lvl.indexOf(v) > -1);
    } catch (e) {
      this.toastr.error(e.error.error);
    }
  }

  confirmReject() {
    this.dialogRef = this.dialog.open(FuseConfirmDialogComponent, {
      disableClose: false
    });
    this.dialogRef.componentInstance.confirmMessage = 'Really reject this registrant?';
    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.reject();
      }
    });
  }

  async reject() {
    try {
      const res = await this.userService.rejectRegistrant(this.userInfo.id);
      //this.toastr.success(res.message);
      this.userInfo.user_status = res.user_status;
    } catch (e) {
      this.toastr.error(e.error.error);
    }
  }

  private setAvatar() {
    if (this.userInfo.ppic_a) {
      this.avatarUrl = this.userInfo.ppic_a;
    } else {
      switch (this.userInfo.sex) {
        case 'male':
          this.avatarUrl = `/assets/images/avatars/nopic_male.jpg`;
        case 'female':
          this.avatarUrl = `/assets/images/avatars/nopic_female.jpg`;
      }
    }
  }

  onAvatarChanged(avatar) {
    this.avatarUrl = avatar;
  }

  private async getUserInfo() {
    try {
      this.userInfo = await this.userService.getUser(this.user.id).toPromise();
      this.setAvatar();
      this.isFavStatusShow =
        ['admin', 'owner'].some(v => this.currentUser.lvl.indexOf(v) > -1)
        && ['staff', 'registrant'].some(v => this.userInfo.lvl.indexOf(v) > -1);
      this.isApproveRejectShow =
        ['registrant'].some(v => this.userInfo.lvl.indexOf(v) > -1);
      this.isSettingsShow =
        ['owner', 'admin', 'staff', 'client', 'ext'].some(v => this.userInfo.lvl.indexOf(v) > -1) && (this.currentUser.id == this.user.id || this.currentUser.lvl == 'owner' || (this.currentUser.lvl == 'admin' && this.userInfo.lvl != 'admin' && this.userInfo.lvl != 'owner'));
      this.isCardsShow =
        ['owner', 'admin', 'staff'].indexOf(this.userInfo.lvl) > -1 && ['owner', 'admin'].indexOf(this.currentUser.lvl) > -1 && this.settings.showcase_module == 1;
      if (['owner', 'client', 'ext'].some(v => this.userInfo.lvl.indexOf(v) > -1)) {
        this.isWorkAreasShow = false;
      } else {
        this.isSkillsShow = true;
      }

      this.ratings = await this.userService.getUserRatings(this.user.id);
      if (this.userInfo.linked === 1 && this.userInfo.id === this.currentUser.id
        && !this.tokenStorage.isExistSecondaryUser()) {
        this.linkedUsers = await this.userService.getLinkedAccounts(this.user.id);
      }
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

  async getTimezones() {
    try {
      const res = await this.userService.getTimezones();
      this.timezones = Object.keys(res).map(key => {
        return {
          value: key,
          label: res[key]
        };
      });
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

  openPhotoTab() {
    const index = this.tabGroup._tabs.toArray().findIndex(tab => tab.textLabel == 'Photos');
    if (index > -1) {
      this.selectedIndex = index;
    }
  }

  onSelectedTabChange(event: MatTabChangeEvent) {
    if (event.tab.textLabel === 'Cards') {
      setTimeout(() => this.cardsTab.drawer.open(), 100);
    }
  }

  async login() {
    try {
      const res = await this.authService.loginAs(this.user.id);
      this.tokenStorage.setSecondaryUser(res.user, res.permissions);
      this.tokenStorage.userSwitchListener.next(true);
      if (res.user.lvl.startsWith('registrant')) {
        const currentStep = this.authService.getCurrentStep();
        this.router.navigate(['/register', currentStep]);
      }
    } catch (e) {
      this.toastr.error((e.error ? e.error.message : e.message) || 'Something is wrong');
    }
  }

  chat() {
    const dialogRef = this.dialog.open(NewMessageDialogComponent, {
      panelClass: 'new-message-dialog'
    });
    dialogRef.afterClosed().subscribe(async message => {
      if (!message) {
        return;
      }
      try {
        await this.chatService.sendMessage({
          recipient_id: this.user.id,
          content: message
        });
      } catch (e) {
        this.scMessageService.error(e);
      }
    });
  }

  get canLoginAs() {
    return ['admin', 'owner'].indexOf(this.currentUser.lvl) > -1 && this.currentUser.id != this.user.id;
  }

  get canChat() {
    return ['admin', 'owner'].indexOf(this.currentUser.lvl) > -1 &&
      this.currentUser.id != this.user.id && this.userInfo && this.userInfo.lvl.indexOf('registrant') < 0;
  }

}

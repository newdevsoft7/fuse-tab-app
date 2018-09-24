import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../../user.service';
import { SCMessageService } from '../../../../../../shared/services/sc-message.service';

@Component({
  selector: 'app-users-settings-email-signature',
  templateUrl: './email-signature.component.html',
  styleUrls: ['./email-signature.component.scss']
})
export class UsersSettingsEmailSignatureComponent implements OnInit {

  @Input() user: any;
  signature: string = '';

  constructor(
    private userService: UserService,
    private scMessageService: SCMessageService
  ) { }

  async ngOnInit() {
    try {
      this.signature = await this.userService.getUserSignature(this.user.id);
    } catch (e) {
      this.scMessageService.error(e);
    }
  }

  async saveSignature() {
    try {
      await this.userService.updateUserSignature(this.user.id, this.signature);
    } catch (e) {
      this.scMessageService.error(e)
    }
  }

}

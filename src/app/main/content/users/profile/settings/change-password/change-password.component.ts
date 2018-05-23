import { Component } from "@angular/core";
import { UserService } from '../../../user.service';
import { TokenStorage } from "../../../../../../shared/services/token-storage.service";
import { CustomLoadingService } from "../../../../../../shared/services/custom-loading.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-users-settings-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class UsersSettingsChangePasswordComponent {
  data: any = {};

  constructor(
    private userService: UserService,
    private spinner: CustomLoadingService,
    private toastr: ToastrService,
    private tokenStorage: TokenStorage) { }

  async doSubmit() {
    try {
      this.spinner.show();
      await this.userService.changePassword(this.tokenStorage.getUser().id, this.data.password).toPromise();
      //this.toastr.success('Password changed');
      this.data = {};
    } catch (e) {
      this.toastr.error(e.error.message);
    } finally {
      this.spinner.hide();
    }
  }
}

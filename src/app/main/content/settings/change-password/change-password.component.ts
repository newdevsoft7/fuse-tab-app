import { Component } from "@angular/core";
import { SettingsService } from "../settings.service";
import { TokenStorage } from "../../../../shared/services/token-storage.service";
import { CustomLoadingService } from "../../../../shared/services/custom-loading.service";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: 'app-settings-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class SettingsChangePasswordComponent {
  data: any = {};

  constructor(
    private settingsService: SettingsService,
    private spinner: CustomLoadingService,
    private toastr: ToastrService,
    private tokenStorage: TokenStorage) {}

  async doSubmit() {
    try {
      this.spinner.show();
      await this.settingsService.changePassword(this.tokenStorage.getUser().id, this.data.password).toPromise();
      this.toastr.success('Password has been changed successfully!');
      this.data = {};
    } catch (e) {
      this.toastr.error(e.error.message);
    } finally {
      this.spinner.hide();
    }
  }
}

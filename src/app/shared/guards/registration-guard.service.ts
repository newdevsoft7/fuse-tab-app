import { Injectable } from "@angular/core";
import { CanActivate, RouterStateSnapshot, Router } from "@angular/router";
import { AppSettingService } from "../services/app-setting.service";
import { AuthenticationService } from "../services/authentication.service";

@Injectable()
export class RegistrationGuardService implements CanActivate {

  constructor(
    private appSetting: AppSettingService,
    private authService: AuthenticationService,
    private router: Router) {}

  canActivate(route, state: RouterStateSnapshot): boolean {
    if (!this.authService.isAuthorized() && this.appSetting.baseData.registration_enable !== '1') {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

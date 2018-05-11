import { Injectable } from "@angular/core";
import { CanActivate, RouterStateSnapshot, Router } from "@angular/router";
import { AppSettingService } from "../services/app-setting.service";

@Injectable()
export class RegistrationGuardService implements CanActivate {

  constructor(
    private appSetting: AppSettingService,
    private router: Router) {}

  canActivate(route, state: RouterStateSnapshot): boolean {
    if (!this.appSetting.baseData.registration_enable) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}

import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AppSettingService } from '../services/app-setting.service';

@Injectable()
export class NotExistGuardService implements CanActivate {

  constructor(
    private appSetting: AppSettingService,
    private router: Router) {}

  canActivate() {
    if (this.appSetting.baseData.name) {
      this.router.navigate(['/home']);
      return false;
    }
    return true;
  }
}

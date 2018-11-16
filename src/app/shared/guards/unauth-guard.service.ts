import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AppSettingService } from '../services/app-setting.service';

@Injectable()
export class UnauthGuardService implements CanActivate {

  constructor(
    private appSetting: AppSettingService,
    private authService: AuthenticationService, 
    private router: Router) {}

  canActivate() {
    if (!this.appSetting.baseData.name) {
      this.router.navigate(['/not-exist']);
      return false;
    }
    if (this.authService.isAuthorized()) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}

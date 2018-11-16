import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { AppSettingService } from '../services/app-setting.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  step: number;

  constructor(
    private appSetting: AppSettingService,
    private authService: AuthenticationService,
    private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.appSetting.baseData.name) {
      this.router.navigate(['/not-exist']);
      return false;
    }
    if (!this.authService.isAuthorized()) {
      this.router.navigate(['login'], { queryParamsHandling: 'merge' });
      return false;
    }
    if (!this.authService.isUserCompleted()) {
      this.router.navigate(['register', this.authService.getCurrentStep()]);
      return false;
    }
    return true;
  }
}

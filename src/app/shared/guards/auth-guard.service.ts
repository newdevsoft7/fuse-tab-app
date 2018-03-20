import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  step: number;

  constructor(
    private authService: AuthenticationService,
    private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (!this.authService.isAuthorized()) {
      this.router.navigate(['login']);
      return false;
    }
    if (state.url.startsWith('/complete')) {
      this.step = parseInt(route.firstChild.params.step);
    } else {
      this.step = null;
    }
    if (!this.authService.isUserCompleted() && this.step !== this.authService.getCurrentCompletedStep()) {
      this.router.navigate(['complete', this.authService.getCurrentCompletedStep()]);
      return false;
    }
    return true;
  }
}

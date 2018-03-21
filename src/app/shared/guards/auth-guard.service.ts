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
    if (!this.authService.isUserCompleted()) {
      this.router.navigate(['register', this.authService.getCurrentStep()]);
      return false;
    }
    return true;
  }
}

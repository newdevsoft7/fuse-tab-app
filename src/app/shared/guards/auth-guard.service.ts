import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class AuthGuardService implements CanActivate {

  constructor(
    private authService: AuthenticationService, 
    private router: Router) {}

  canActivate() {
    if (!this.authService.isAuthorized()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}

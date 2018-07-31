import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { AuthenticationService } from '../services/authentication.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { AppSettingService } from '../services/app-setting.service';

@Injectable()
export class SCHttpInterceptor implements HttpInterceptor {

  unauthEndpoints: any = [
    'auth/login',
    'auth/register',
    'auth/logout',
    'auth/forgottenPassword',
    'auth/resetPassword'
  ];

  unauthRegexes: RegExp[] = [
    /\/user\/([0-9]+)\/card\/([0-9]+)/
  ]

  constructor(
    private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const appSettingService = this.injector.get(AppSettingService);
    const authService = this.injector.get(AuthenticationService);

    const baseUrl = `https://api.${appSettingService.baseData.name}.staffconnect-app.com/api`;
    req = req.clone({ url: `${baseUrl}${req.url}` });

    req = this.getRequestWithToken(req, authService.getAccessToken());

    return next.handle(req).catch(error => {
      if (error.status === 401 && this.isAuthUrl(req.url)) {
        if (req.url.endsWith('refresh')) {
          authService.refreshing = false;
          authService.logout();
        } else {
          return authService.refreshToken()
            .switchMap(() => {
              req = this.getRequestWithToken(req, authService.getAccessToken());
              return next.handle(req);
            });
        }
      }

      return Observable.throw(error);
    });
  }

  private isAuthUrl(url: string): boolean {
    let isAuth = true;
    for (let endpoint of this.unauthEndpoints) {
      if (url.indexOf(endpoint) > -1) {
        isAuth = false;
        break;
      }
    }
    if (isAuth) {
      for (let regex of this.unauthRegexes) {
        if (regex.test(url)) {
          isAuth = false;
          break;
        }
      }
    }
    return isAuth;
  }

  private getRequestWithToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('authorization', `Bearer ${token}`)
    });
  }
}

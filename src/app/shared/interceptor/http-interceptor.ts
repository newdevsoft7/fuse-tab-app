import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';

import { AuthenticationService } from '../services/authentication.service';
import { AppSettingService } from '../services/app-setting.service';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class SCHttpInterceptor implements HttpInterceptor {

  authService: AuthenticationService;
  appSettingService: AppSettingService;

  constructor(
    private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.authService = this.injector.get(AuthenticationService);
    this.appSettingService = this.injector.get(AppSettingService);

    req = this.getRequestWithToken(req, this.authService.getAccessToken());

    return this.getUpdatedRequest(req, next).mergeAll();
  }

  private getUpdatedRequest(req: HttpRequest<any>, next: HttpHandler): Observable<Observable<HttpEvent<any>>> {
    return new Observable((observer) => {
      if (!this.appSettingService.baseData) {
        this.appSettingService.baseDataUpdated$.subscribe(async (isUpdated: boolean) => {
          if (isUpdated) {
            req = req.clone({ url: `${this.appSettingService.baseData.url}${req.url}` });
            observer.next(this.getHandler(req, next));
            observer.complete();
          }
        });
      } else {
        req = req.clone({ url: `${this.appSettingService.baseData.url}${req.url}` });
        observer.next(this.getHandler(req, next));
        observer.complete();
      }
    });
  }

  private getHandler(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).catch(error => {
      if (error.status === 401) {
        if (req.url.endsWith('refresh')) {
          this.authService.refreshing = false;
          this.authService.logout();
        } else {
          return this.authService.refreshToken()
            .switchMap(() => {
              req = this.getRequestWithToken(req, this.authService.getAccessToken());
              return next.handle(req);
            });
        }
      }

      return Observable.throw(error);
    });
  }

  private getRequestWithToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('authorization', `Bearer ${token}`)
    });
  }
}

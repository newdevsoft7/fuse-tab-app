import { Injectable, Injector } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';

import 'rxjs/add/operator/do';
import { AuthenticationService } from '../services/authentication.service';

@Injectable()
export class SCHttpInterceptor implements HttpInterceptor {

  constructor(
    private injector: Injector) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authService = this.injector.get(AuthenticationService);

    req = this.getRequestWithToken(req, authService.getAccessToken());

    return next.handle(req).catch(error => {
      if (error instanceof HttpErrorResponse && error.status === 401) {
          return authService.refreshToken()
              .switchMap((token) => {
                  console.log('=====', authService.getAccessToken());
                  req = this.getRequestWithToken(req, authService.getAccessToken());
                  return next.handle(req);
              });
      }

      return Observable.throw(error);
    });

    // return next.handle(req).do((event: HttpEvent<any>) => {
    //   if (event instanceof HttpResponse) {
    //     // silence is golden
    //     return next.handle(req);
    //   }
    // }, async (err: Error) => {
    //   if (err instanceof HttpErrorResponse) {
    //     if (err.status === 401) {
    //       if (!authService.refreshing) {
    //         await authService.refreshToken();
    //         console.log('*****', authService.getAccessToken());
    //         req = this.getRequestWithToken(req, authService.getAccessToken());
    //         console.log('=====', JSON.stringify(req));
    //         next.handle(req);
    //       }
    //     }
    //   }
    // });
  }

  private getRequestWithToken(req: HttpRequest<any>, token: string): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set('authorization', `Bearer ${token}`)
    });
  }
}

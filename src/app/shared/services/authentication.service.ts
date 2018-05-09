import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Observable';
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Router} from '@angular/router';

import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';

import {environment} from '../../../environments/environment';
import {TokenStorage} from './token-storage.service';

import {UsersChatService} from '../../main/content/users/chat/chat.service';
import {FavicoService} from './favico.service';
import { AppSettingService } from './app-setting.service';

const BASE_URL = `${environment.apiUrl}`;
const AUTH_URL = `${BASE_URL}/auth`;

interface AccessData {
  access_token: string;
  refresh_token: string;
  user: any;
  settings: any;
  message: string;
  steps: any;
  forms_required: any[];
}

@Injectable()
export class AuthenticationService {

  refreshing: boolean = false;
  tokenRefreshed$: BehaviorSubject<any> = new BehaviorSubject(null);
  loginUrl: string;

  constructor(private http: HttpClient,
              private tokenStorage: TokenStorage,
              private router: Router,
              private usersChatService: UsersChatService,
              private appSettingService: AppSettingService,
              private favicoService: FavicoService) {

    this.loginUrl = `https://api.${appSettingService.baseData.name}.staffconnect-app.com/login`;
  }

  /**
   * Check, if user already authorized.
   * @description Should return true or false
   * @returns {boolean}
   * @memberOf AuthService
   */
  public isAuthorized(): boolean {
    return !!this.getAccessToken();
  }

  /**
   * Get access token
   * @description Should return access token
   * localStorage
   * @returns {string}
   */
  public getAccessToken(): string {
    return this.tokenStorage.getAccessToken();
  }

  /**
   * Function, that should perform refresh token verifyTokenRequest
   * @returns {Observable<any>}
   */
  public refreshToken(): Observable<AccessData> {
    if (this.refreshing) {
      return new Observable(observer => {
        this.tokenRefreshed$.subscribe((res) => {
          if (res) {
            observer.next();
            observer.complete();
          }
        });
      });
    } else {
      this.refreshing = true;

      return this.http.post(`${AUTH_URL}/refresh`, {
        refresh_token: this.tokenStorage.getRefreshToken(),
        client_id: environment.clientId
      })
        .map((tokens: AccessData) => {
          this.saveAccessData(tokens);
          this.tokenRefreshed$.next(true);
          this.refreshing = false;
        })
        .catch((err) => {
          this.refreshing = false;
          return this.handleError(err);
        });
    }
  }

  public refreshShouldHappen(response: HttpErrorResponse): boolean {
    return response.status === 401;
  }

  public login(username: string, password: string) {

    return this.http.post(`${AUTH_URL}/login`, {username, password, client_id: environment.clientId})
      .map((tokens: AccessData) => this.saveAccessData(tokens))
      .catch(this.handleError);
  }


  /* Workaround to authentificate user with passport as OAuth provider */
  public openWindowWithPost(windowoption: string, name: string, params: any) {
    const form = document.createElement('form');
    form.setAttribute('method', 'post');
    form.setAttribute('action', this.loginUrl);
    form.setAttribute('target', name);
    for (let i in params) {
      if (params.hasOwnProperty(i)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = i;
        input.value = params[i];
        form.appendChild(input);
      }
    }
    document.body.appendChild(form);
    // note I am using a post.htm page since I did not want to make double request to the page
    // it might have some Page_Load call which might screw things up.
    const loginWindow = window.open('post.htm', name, windowoption);
    form.submit();
    document.body.removeChild(form);
    setTimeout(function () {
      loginWindow.close();
    }, 5000);

  }

  public register(params) {
    return this.http.post(`${BASE_URL}/auth/register`, params)
      .map((tokens: AccessData) => {
        this.saveAccessData(tokens);
        return tokens;
      })
      .catch(this.handleError);
  }

  public loginAs(user_id: number): Promise<any> {
    const url = `${AUTH_URL}/loginAs`;
    return this.http.post(`${AUTH_URL}/loginAs`, {user_id}).toPromise();
  }

  public logoutAs(): Promise<any> {
    const url = `${AUTH_URL}/logoutAs`;
    return this.http.post(`${AUTH_URL}/logoutAs`, {}).toPromise();
  }

  public async logout() {
    if (this.tokenStorage.isExistSecondaryUser()) {
      await this.logoutAs();
      this.tokenStorage.removeSecondaryUser();
      this.favicoService.setBadge(0);
      this.tokenStorage.userSwitchListener.next(true);
    } else {
      try {
        await this.usersChatService.removeDevice();
      } catch (e) {
      }
      this.usersChatService.Device = null;
      this.http.post(`${AUTH_URL}/logout`, {}).subscribe(res => {
      });
      this.tokenStorage.clear();
      this.favicoService.setBadge(0);
      this.router.navigate(['/login']);
    }
  }

  sendForgotPasswordLink(body): Promise<any> {
    const url = `${AUTH_URL}/forgottenPassword`;
    return this.http.post(url, body).toPromise();
  }

  resetPassword(body): Promise<any> {
    const url = `${AUTH_URL}/resetPassword`;
    return this.http.post(url, body).toPromise();
  }

  public verifyTokenRequest(url: string): boolean {
    return url.endsWith('refresh');
  }

  public isUserCompleted(): boolean {
    const userLevel = this.tokenStorage.getUser().lvl;
    return userLevel.indexOf('registrant') === -1;
  }

  public getCurrentStep(): number {
    if (this.isUserCompleted()) return 0;
    const step = parseInt(this.tokenStorage.getUser().lvl.replace('registrant', ''));
    return step < 8 ? step : 7;
  }

  // public getHeaders(token) {
  //     return  {'X-Auth-Token': token};
  // }

  private handleError(error: Response | any) {
    return Observable.throw(error);
  }

  /**
   * Save access data in the storage
   *
   * @private
   * @param {AccessData} data
   */
  private saveAccessData({access_token, refresh_token, user, settings, steps, forms_required}: AccessData) {
    if (access_token) {
      this.tokenStorage.setAccessToken(access_token);
    }
    if (refresh_token) {
      this.tokenStorage.setRefreshToken(refresh_token);
    }
    if (settings) {
      this.tokenStorage.setSettings(settings);
    }
    if (steps) {
      this.tokenStorage.setSteps(steps);
    }
    if (user) {
      this.tokenStorage.setUser(user);
    }
    if (forms_required && forms_required.length > 0) {
      this.tokenStorage.setFormData(forms_required);
    }
  }

}

import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TokenStorage } from '../../../../shared/services/token-storage.service';
import { Subscription } from 'rxjs/Subscription';
import { ConnectorService } from '../../../../shared/services/connector.service';
import { environment } from '../../../../../environments/environment';

@Component({
    selector: 'app-form',
    templateUrl: './form.component.html',
    styleUrls: ['./form.component.scss']
})
export class FormComponent implements OnInit, OnDestroy {

    iframeUrl: string;
    data: any;

    formconnectData: any;

    connectorSubscription: Subscription;

    private _loading: boolean = false;

    get loading(): boolean {
        return this._loading;
    }

    set loading(value: boolean) {
        if (value !== null) {
            this._loading = value;
        }
    }

    @Input('data')
    set updateData(data: any) {
        if (data) {
            this.data = data;
            if (this.connectorService.formconnectTokenRefreshing$.value) {
              this.iframeUrl = '';
            } else {
              this.updateIframe();
            }
        }
    }

    @Input() url: string;

    constructor(
        private tokenStorage: TokenStorage,
        private connectorService: ConnectorService
    ) {}

    ngOnInit() {
        this.connectorSubscription = this.connectorService.formconnectTokenRefreshing$.subscribe((res: boolean) => {
            if (!res && res !== null) {
              this.updateIframe();
            }
        });
    }

    ngOnDestroy() {
        this.connectorSubscription.unsubscribe();
    }

    refreshIframe() {
        this.loading = true;

        let iframeUrl;
        this.formconnectData = this.tokenStorage.getFormconnectData();

        if (this.data && this.data.other_id && !this.data.isEdit) {
            iframeUrl = `${environment.formconnectUrl}/main/templates/signup/${this.data.other_id}`;
        } else if (this.data && this.data.other_id && this.data.isEdit) {
            iframeUrl = `${environment.formconnectUrl}/main/templates/edit/${this.data.other_id}`;
        } else if (this.data && !this.data.other_id) {
            iframeUrl = `${environment.formconnectUrl}/main/templates/create`;
        }
        let count = 0;
        for (let key in this.formconnectData) {
            iframeUrl += `${ count === 0 ? '?' : '&' }${key}=${this.formconnectData[key]}`;
            count++;
        }
        iframeUrl += `&tab_url=${this.url}`;
        this.iframeUrl = iframeUrl;
    }

    private updateIframe() {
        this.iframeUrl = '';
        setTimeout(() => {
          this.refreshIframe();
        });
    }
}

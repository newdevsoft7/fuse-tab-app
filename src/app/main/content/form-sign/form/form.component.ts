import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { TokenStorage } from '../../../../shared/services/token-storage.service';
import { AuthenticationService } from '../../../../shared/services/authentication.service';
import { Subscription } from 'rxjs/Subscription';
import { ConnectorService } from '../../../../shared/services/connector.service';
import { CustomLoadingService } from '../../../../shared/services/custom-loading.service';
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

    @Input('data') set updateData(data: any) {
        this.data = data;
        this.refreshIframe();
    }

    constructor(
        private tokenStorage: TokenStorage,
        private connectorService: ConnectorService,
        private spinner: CustomLoadingService
    ) {}

    ngOnInit() {
        if (this.connectorService.formconnectTokenRefreshing$.value) {
            this.iframeUrl = '';
        } else {
            this.refreshIframe();
        }
        this.connectorSubscription = this.connectorService.formconnectTokenRefreshing$.subscribe((res: boolean) => {
            if (!res) {
                this.iframeUrl = '';
                setTimeout(() => {
                    this.refreshIframe();
                });
            }
        });
    }

    ngOnDestroy() {
        this.connectorSubscription.unsubscribe();
    }

    refreshIframe() {
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
        this.iframeUrl = iframeUrl;
    }
}

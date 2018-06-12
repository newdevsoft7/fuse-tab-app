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
        // this.spinner.show();

        this.connectorSubscription = this.connectorService.formconnectUpdated$.subscribe((res: boolean) => {
            if (res) {
                this.iframeUrl = '';
                setTimeout(() => {
                    this.refreshIframe();
                });
            }
        });

        if (window.addEventListener) {
            window.addEventListener('message', this.onMessage.bind(this), false);
        } else if ((<any>window).attachEvent) {
            (<any>window).attachEvent('onmessage', this.onMessage.bind(this), false);
        }
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

    onMessage(event: any) {
        if (event.data && event.data.func && event.data.message === 'contentLoaded' && event.data.id === this.data.other_id) {
            // this.spinner.hide();
        }
    }
}

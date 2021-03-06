import { Component, Input, OnDestroy, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Subscription } from "rxjs/Subscription";
import { TokenStorage } from "../../../shared/services/token-storage.service";
import { ConnectorService } from "../../../shared/services/connector.service";
import { environment } from "../../../../environments/environment";

@Component({
  selector: 'app-showcase',
  templateUrl: './showcase.component.html',
  styleUrls: ['./showcase.component.scss']
})
export class ShowcaseComponent implements OnInit, OnDestroy {
  iframeUrl: string;
  data: any;

  showcaseconnectData: any;
  connectorSubscription: Subscription;

  @ViewChild('showcaseContent') showcaseContent: ElementRef;

  private _loading: boolean = false;

  get loading(): boolean {
    return this._loading;
  }

  set loading(value: boolean) {
    if (value !== null) {
      this._loading = value;
      if (!value) {
        this.showcaseContent.nativeElement.contentWindow.postMessage({
          ...this.data.payload,
          type: this.data.type
        }, "*");
      }
    }
  }

  @Input('data')
  set updateData(data: any) {
    if (data) {
      this.data = data;
      if (this.connectorService.showcaseconnectTokenRefresing$.value) {
        this.iframeUrl = '';
      } else {
        this.updateIframe();
      }
    }
  }

  @Input() url: string;

  constructor(
    private tokenStorage: TokenStorage,
    private connectorService: ConnectorService,
  ) {}

  refreshIframe() {
    this.loading = true;

    let iframeUrl;
    this.showcaseconnectData = this.tokenStorage.getShowcaseconnectData();

    if (this.data && this.data.template_id) {
      iframeUrl = `${environment.showcaseconnectUrl}/main/templates/${this.data.edit ? 'edit' : 'view'}/${this.data.template_id}`;
    } else {
      iframeUrl = `${environment.showcaseconnectUrl}/main/templates/create`;
    }

    let count = 0;
    for (let key in this.showcaseconnectData) {
        iframeUrl += `${ count === 0 ? '?' : '&' }${key}=${this.showcaseconnectData[key]}`;
        count++;
    }

    if (this.url) {
      iframeUrl += `&tab_url=${this.url}`;
    }

    if (this.data.public && !this.showcaseconnectData) {
      iframeUrl += `?public=${this.data.public}`;
    }

    this.iframeUrl = iframeUrl;
  }

  ngOnInit() {
    this.connectorSubscription = this.connectorService.showcaseconnectTokenRefresing$.subscribe((res: boolean) => {
      if (!res && res !== null) {
        this.updateIframe();
      }
    });
  }

  private updateIframe() {
    this.iframeUrl = '';
    setTimeout(() => {
      this.refreshIframe();
    });
  }

  ngOnDestroy() {
    this.connectorSubscription.unsubscribe();
  }
}

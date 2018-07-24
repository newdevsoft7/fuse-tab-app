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
        this.showcaseContent.nativeElement.contentWindow.postMessage(this.data.payload, "*");
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

    iframeUrl = `${environment.showcaseconnectUrl}/main/templates/create`;

    let count = 0;
    for (let key in this.showcaseconnectData) {
        iframeUrl += `${ count === 0 ? '?' : '&' }${key}=${this.showcaseconnectData[key]}`;
        count++;
    }

    iframeUrl += `&tab_url=${this.url}`;
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

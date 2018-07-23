import {Component, OnInit, Input} from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Subscription } from 'rxjs/Subscription';
import { ConnectorService } from '../../../shared/services/connector.service';
import { TokenStorage } from '../../../shared/services/token-storage.service';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  iframeUrl: string;
  data: any;

  quizconnectData: any;
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
      if (this.connectorService.quizconnectTokenRefreshing$.value) {
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
    this.quizconnectData = this.tokenStorage.getQuizconnectData();

    if (this.data && this.data.other_id && !this.data.isEdit) { // Run / View survey / quiz
      iframeUrl = `${environment.quizconnectUrl}/main/surveys/view/${this.data.other_id}`;
    } else if (this.data && this.data.other_id && this.data.isEdit) { // Edit survey / quiz
      iframeUrl = `${environment.quizconnectUrl}/main/surveys/edit/${this.data.other_id}`;
    } else if (this.data && !this.data.other_id && !this.data.other_ids) { // Create Survey / quiz
      iframeUrl = `${environment.quizconnectUrl}/main/surveys/create`;
    } else if (this.data && this.data.other_ids) {
      iframeUrl = `${environment.quizconnectUrl}/main/surveys/results`;
    }
    let count = 0;
    for (let key in this.quizconnectData) {
        iframeUrl += `${ count === 0 ? '?' : '&' }${key}=${this.quizconnectData[key]}`;
        count++;
    }
    if (this.data.type) {
      iframeUrl += `&kind=${this.data.type}`;
    }
    if (this.data.shift_id) {
      iframeUrl += `&shift=${this.data.shift_id}`;
    }
    if (this.data.view) { // View survey / quiz
      iframeUrl += `&view=${this.data.view}`;
      if (this.data.view == 'contentedit') {
        iframeUrl += `&approved=${this.data.approved}`;
      }
      if (this.data.view == 'customdata' && this.data.pass_data) {
        iframeUrl += `&pass_data=${encodeURI(this.data.pass_data)}`;
      }
    }
    if (this.data.other_ids) {
      iframeUrl += `&ids=${this.data.other_ids.join(',')}`;
    }
    iframeUrl += `&tab_url=${this.url}`;
    this.iframeUrl = iframeUrl;
  }

  ngOnInit() {
    this.connectorSubscription = this.connectorService.quizconnectTokenRefreshing$.subscribe((res: boolean) => {
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

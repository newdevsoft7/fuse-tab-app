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

  @Input('data') set updateData(data: any) {
    this.data = data;
    this.refreshIframe();
  }

  constructor(
    private tokenStorage: TokenStorage,
    private connectorService: ConnectorService,
  ) {}

  refreshIframe() {
    let iframeUrl;
    this.quizconnectData = this.tokenStorage.getQuizconnectData();

    if (this.data && this.data.other_id && !this.data.isEdit) {
      iframeUrl = `${environment.quizconnectUrl}/main/surveys/view/${this.data.other_id}`;
      // if (this.data.shift_id) {
      //   iframeUrl += '&shift' + this.data.shift_id;
      // }
    } else if (this.data && this.data.other_id && this.data.isEdit) {
      iframeUrl = `${environment.quizconnectUrl}/main/surveys/edit/${this.data.other_id}`;
    } else if (this.data && !this.data.other_id) {
      if (this.data.type === 'survey') {
        iframeUrl = `${environment.quizconnectUrl}/main/surveys/create?&kind=survey`;
      } else {
        iframeUrl = `${environment.quizconnectUrl}/main/surveys/create?&kind=quiz`;
      }
    }
    let count = 0;
    for (let key in this.quizconnectData) {
        iframeUrl += `${ count === 0 ? '?' : '&' }${key}=${this.quizconnectData[key]}`;
        count++;
    }
    this.iframeUrl = iframeUrl;
  }

  ngOnInit() {
    this.connectorSubscription = this.connectorService.quizconnectUpdated$.subscribe((res: boolean) => {
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

  onMessage(event: any) {
    if (event.data && event.data.func && event.data.message === 'contentLoaded' && event.data.id === this.data.other_id) {
      // this.spinner.hide();
    }
  }
}

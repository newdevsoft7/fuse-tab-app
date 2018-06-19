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
    if (this.connectorService.quizconnectTokenRefreshing$.value) {
      this.iframeUrl = '';
    } else {
      this.refreshIframe();
    }
    this.connectorSubscription = this.connectorService.quizconnectTokenRefreshing$.subscribe((res: boolean) => {
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

}

import {Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss']
})
export class QuizComponent implements OnInit {

  iframeUrl: string;
  data: any;

  @Input('data') set updateData(data: any) {
    this.data = data;
    console.log(data);
    if (this.data && this.data.other_id && !this.data.isEdit) {
      this.iframeUrl = `https://quizconnect.net/main/surveys/view/${this.data.other_id}?provider=staffconnect&type=iframe`;

      if (this.data.shift_id) {
        this.iframeUrl += '&shift' + this.data.shift_id;
      }
    } else if (this.data && this.data.other_id && this.data.isEdit) {
      this.iframeUrl = `https://quizconnect.net/main/surveys/edit/${this.data.other_id}?provider=staffconnect&type=iframe`;
    } else if (this.data && !this.data.other_id) {
      if (data.type === 'survey') {
        this.iframeUrl = `https://quizconnect.net/main/surveys/create?provider=staffconnect&type=iframe&kind=survey`;
      } else {
        this.iframeUrl = `https://quizconnect.net/main/surveys/create?provider=staffconnect&type=iframe&kind=quiz`;
      }

    }
  }

  constructor() {
  }

  ngOnInit() {
  }
}

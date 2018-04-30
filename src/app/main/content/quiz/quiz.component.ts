import { Component, OnInit, Input } from '@angular/core';

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
    if (this.data && this.data.other_id && !this.data.isEdit) {
      this.iframeUrl = `https://quizconnect.net/main/surveys/view/${this.data.other_id}?provider=staffconnect&type=iframe`;
    } else if (this.data && this.data.other_id && this.data.isEdit) {
      this.iframeUrl = `https://quizconnect.net/main/surveys/edit/${this.data.other_id}?provider=staffconnect&type=iframe`;
    } else if (this.data && !this.data.other_id) {
      this.iframeUrl = `https://quizconnect.net/main/surveys/create?provider=staffconnect&type=iframe`;
    }
  }

  constructor() { }

  ngOnInit() {}
}

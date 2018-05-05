import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
  selector: 'app-tracking-option-files',
  templateUrl: './option-files.component.html',
  styleUrls: ['./option-files.component.scss']
})
export class TrackingOptionFilesComponent {
  @Input() data: any;

  @Output() addFile: EventEmitter<any> = new EventEmitter();
  @Output() removeFile: EventEmitter<any> = new EventEmitter();

  constructor() { }
}

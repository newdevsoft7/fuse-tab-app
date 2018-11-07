import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-presentation-edit-in-out-text',
  templateUrl: './edit-in-out-text.component.html',
  styleUrls: ['./edit-in-out-text.component.scss']
})
export class PrsentationEditInOutTextComponent implements OnInit, OnChanges {

  @Input() title: string;
  @Input() text: string;
  @Input() presentationId: number;
  @Output() textChange: EventEmitter<string> = new EventEmitter<string>();

  isTextChanged = false;

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.presentationId) {
      this.isTextChanged = false;
    }
  }

  save() {
    this.textChange.next(this.text);
    this.isTextChanged = false;
  }

  onChange(value) {
    this.isTextChanged = true;
    this.text = value;
  }

}

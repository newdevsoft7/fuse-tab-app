import { Component, Input, EventEmitter, Output } from "@angular/core";

@Component({
  selector: 'app-editable-text',
  templateUrl: './editable-text.component.html',
  styleUrls: ['./editable-text.component.scss']
})
export class EditableTextComponent {
  formActive: boolean = false;

  text: string;
  initText: string;

  @Input('value')
  set updateValue(value: string) {
    this.initText = value;
    this.text = value;
  }

  @Output() saveChange: EventEmitter<string> = new EventEmitter();
}

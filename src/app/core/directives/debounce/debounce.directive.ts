import { Directive, Input, ElementRef, Output, EventEmitter, OnInit } from '@angular/core';
import { NgModel } from '@angular/forms';
import { Observable } from 'rxjs/Rx';

@Directive({
  selector: '[debounce]'
})
export class DebounceDirective implements OnInit {
  @Input() delay: number = 500;
  @Output() onValueChange:EventEmitter<any> = new EventEmitter<any>();

  constructor(private elementRef: ElementRef, private model:NgModel) {}

  ngOnInit() {
    const eventStream = Observable.fromEvent(this.elementRef.nativeElement, 'keyup')
      .map(() => this.model.value)
      .debounceTime(this.delay);

    eventStream.subscribe(input => {
      this.onValueChange.next(input);
    });
  }
}

import { Input, Component, OnInit, OnDestroy, ViewChild, ElementRef, } from '@angular/core';
import { Subscription, BehaviorSubject } from 'rxjs';

@Component({
  selector: 'app-users-showcase-view',
  templateUrl: './showcase-view.component.html',
  styleUrls: ['./showcase-view.component.scss']
})
export class UsersShowcaseViewComponent implements OnInit, OnDestroy {

  @Input() iframeUrl: string;
  @Input() shouldRefresh: BehaviorSubject<boolean>;
  @ViewChild('iframe') iframe: ElementRef;

  refreshSubscription: Subscription;

  constructor() { }

  ngOnInit() {
    this.refreshSubscription = this.shouldRefresh.subscribe(isRefresh => {
      if (!isRefresh) { return; }
      if (this.iframe) {
        this.iframe.nativeElement.src += '';
      }
    });
  }

  ngOnDestroy() {
    this.refreshSubscription.unsubscribe();
  }

}

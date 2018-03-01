import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class ActivityManagerService {

  isFocused: boolean;
  focusWatcher: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor() {}

  detectActivityChange() {
    window.addEventListener('focus', () => {
      this.isFocused = true;
      this.focusWatcher.next(true);
    });

    window.addEventListener('blur', () => {
      this.isFocused = false;
      this.focusWatcher.next(false);
    });
  }
}

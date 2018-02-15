import { Injectable } from '@angular/core';

@Injectable()
export class ActivityManagerService {

  isFocused: boolean;

  constructor() {}

  detectActivityChange() {
    window.addEventListener('focus', () => {
      this.isFocused = true;
    });

    window.addEventListener('blur', () => {
      this.isFocused = false;
    });
  }
}

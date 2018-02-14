import { Injectable } from '@angular/core';
import * as Favico from 'favico.js';

@Injectable()
export class FavicoService {
  private _favicon: any;

  constructor() {
    this._favicon = new Favico({
      type: 'rectangle',
      animation:'fade'
    });
  }

  setBadge(value: number) {
    this._favicon.badge(value);
  }
}

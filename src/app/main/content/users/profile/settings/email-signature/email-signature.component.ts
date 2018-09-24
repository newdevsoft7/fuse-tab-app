import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-users-settings-email-signature',
  templateUrl: './email-signature.component.html',
  styleUrls: ['./email-signature.component.scss']
})
export class UsersSettingsEmailSignatureComponent implements OnInit {

  @Input() user: any;
  signature: string = '';
  constructor() { }

  ngOnInit() {
  }

}

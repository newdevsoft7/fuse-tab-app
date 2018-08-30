import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector   : 'fuse-confirm-text-yes-no-dialog',
    templateUrl: './confirm-text-yes-no-dialog.component.html',
    styleUrls  : ['./confirm-text-yes-no-dialog.component.scss']
})
export class FuseConfirmTextYesNoDialogComponent implements OnInit
{
    public confirmMessage: string;
    public confirmTitle = 'Confirm';
    public visibleBtnYes: boolean = true;
    public visibleBtnNo: boolean = true;
    public btnYesTitle: string = 'Yes';
    public btnNoTitle: string = 'No';
    public placeholder: string = 'Note here';

    text: string;

    constructor(public dialogRef: MatDialogRef<FuseConfirmTextYesNoDialogComponent>)
    {
    }

    ngOnInit()
    {
    }

}

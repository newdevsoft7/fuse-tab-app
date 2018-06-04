import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector   : 'fuse-confirm-yes-no-dialog',
    templateUrl: './confirm-yes-no-dialog.component.html',
    styleUrls  : ['./confirm-yes-no-dialog.component.scss']
})
export class FuseConfirmYesNoDialogComponent implements OnInit
{
    public confirmMessage: string;
    public confirmTitle = 'Confirm';
    public visibleBtnYes: boolean = true;
    public visibleBtnNo: boolean = true;
    public btnYesTitle: string = 'Yes';
    public btnNoTitle: string = 'No';

    constructor(public dialogRef: MatDialogRef<FuseConfirmYesNoDialogComponent>)
    {
    }

    ngOnInit()
    {
    }

}

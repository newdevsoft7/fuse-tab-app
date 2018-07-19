import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialogRef } from '@angular/material';

@Component({
    selector   : 'fuse-info-dialog',
    templateUrl: './info-dialog.component.html',
    styleUrls  : ['./info-dialog.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseInfoDialogComponent implements OnInit
{
    public message: string;
    public title: string = 'Information';

    constructor(public dialogRef: MatDialogRef<FuseInfoDialogComponent>)
    {
    }

    ngOnInit()
    {
    }

}

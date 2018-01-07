import { Component, HostBinding, Input, OnInit } from '@angular/core';
import { TabService } from '../../../../../main/tab/tab.service';
import { Tab } from '../../../../../main/tab/tab';

@Component({
    selector   : 'fuse-nav-vertical-item',
    templateUrl: './nav-vertical-item.component.html',
    styleUrls  : ['./nav-vertical-item.component.scss']
})
export class FuseNavVerticalItemComponent implements OnInit
{
    @HostBinding('class') classes = 'nav-item';
    @Input() item: any;

    constructor(private tabService: TabService)
    {
    }

    ngOnInit()
    {
    }

    openTab(tab: Tab) {
        this.tabService.openTab(tab);
    }
}

import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';

import { FuseHomeComponent } from './home.component';

const routes = [
    {
        path     : 'home',
        component: FuseHomeComponent
    }
];

@NgModule({
    declarations: [
        FuseHomeComponent
    ],
    imports     : [
        SharedModule,
        RouterModule.forChild(routes)
    ],
    exports     : [
        FuseHomeComponent
    ]
})

export class FuseHomeModule
{
}

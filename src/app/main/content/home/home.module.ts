import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../../../core/modules/shared.module';
import { TabModule } from '../../tab/tab.module';
import { UsersModule } from '../users/users.module';

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
        TabModule,
        UsersModule,
        RouterModule.forChild(routes)
    ],
    exports     : [
        FuseHomeComponent
    ]
})

export class FuseHomeModule
{
}

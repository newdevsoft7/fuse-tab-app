import { NgModule } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { StaticMultiSelectComponent } from './static-multi-select.component';

@NgModule({
    declarations: [
        StaticMultiSelectComponent
    ],
    imports     : [
        SharedModule,
    ],
    exports     : [
        StaticMultiSelectComponent
    ]
})
export class StaticMultiSelectModule
{
}

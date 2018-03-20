import { NgModule } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { CustomMultiSelectGroupComponent } from './custom-multi-select-group.component';

@NgModule({
    declarations: [
        CustomMultiSelectGroupComponent
    ],
    imports     : [
        SharedModule,
    ],
    exports     : [
        CustomMultiSelectGroupComponent
    ]
})
export class CustomMultiSelectGroupModule
{
}

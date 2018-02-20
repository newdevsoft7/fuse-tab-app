import { NgModule } from '@angular/core';
import { SharedModule } from '../../modules/shared.module';
import { CustomMultiSelectComponent } from './custom-multi-select.component';

@NgModule({
    declarations: [
        CustomMultiSelectComponent
    ],
    imports     : [
        SharedModule,
    ],
    exports     : [
        CustomMultiSelectComponent
    ]
})
export class CustomMultiSelectModule
{
}

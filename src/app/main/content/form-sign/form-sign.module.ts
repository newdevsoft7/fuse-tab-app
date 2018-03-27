import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { FormComponent } from './form/form.component';
import { FormSignComponent } from './form-sign.component';

@NgModule({
    imports         : [
        CommonModule,
        SharedModule
    ],
    declarations    : [
        FormComponent,
        FormSignComponent
    ],
    exports         : [
        FormComponent,
        FormSignComponent
    ],
    entryComponents : [
    ]

})
export class FormSignModule { }

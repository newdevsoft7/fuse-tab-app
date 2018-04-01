import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../../../core/modules/shared.module';
import { FormComponent } from './form/form.component';
import { FormSignComponent } from './form-sign.component';
import { FormSignService } from './form-sign.service';

@NgModule({
    imports         : [
        CommonModule,
        SharedModule
    ],
    declarations    : [
        FormComponent,
        FormSignComponent
    ],
    providers: [ FormSignService ],
    exports         : [
        FormComponent,
        FormSignComponent
    ],
    entryComponents : [
    ]

})
export class FormSignModule { }

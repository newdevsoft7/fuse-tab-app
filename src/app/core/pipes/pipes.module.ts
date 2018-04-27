import { NgModule } from '@angular/core';

import { KeysPipe } from './keys.pipe';
import { GetByIdPipe } from './getById.pipe';
import { HtmlToPlaintextPipe } from './htmlToPlaintext.pipe';
import { FilterPipe } from './filter.pipe';
import { CamelCaseToDashPipe } from './camelCaseToDash.pipe';
import { SafePipe } from './safe.pipe';
import { CapitalizePipe } from './capitalize.pipe';
import { PartialAmountPipe } from './partial-amount.pipe';

@NgModule({
    declarations: [
        KeysPipe,
        GetByIdPipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        CamelCaseToDashPipe,
        SafePipe,
        CapitalizePipe,
        PartialAmountPipe
    ],
    imports     : [],
    exports     : [
        KeysPipe,
        GetByIdPipe,
        HtmlToPlaintextPipe,
        FilterPipe,
        CamelCaseToDashPipe,
        SafePipe,
        CapitalizePipe,
        PartialAmountPipe
    ]
})

export class FusePipesModule
{

}

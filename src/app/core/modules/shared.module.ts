import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { NgSelectModule } from '@ng-select/ng-select';

import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ColorPickerModule } from 'ngx-color-picker';
import { NgxDnDModule } from '@swimlane/ngx-dnd';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { TextMaskModule } from 'angular2-text-mask';

import { FuseMatSidenavHelperDirective, FuseMatSidenavTogglerDirective } from '../directives/fuse-mat-sidenav-helper/fuse-mat-sidenav-helper.directive';
import { FuseMatSidenavHelperService } from '../directives/fuse-mat-sidenav-helper/fuse-mat-sidenav-helper.service';
import { FusePipesModule } from '../pipes/pipes.module';
import { FuseConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { FuseCountdownComponent } from '../components/countdown/countdown.component';
import { FuseMatchMedia } from '../services/match-media.service';
import { FuseNavbarVerticalService } from '../../main/navbar/vertical/navbar-vertical.service';
import { FuseHljsComponent } from '../components/hljs/hljs.component';
import { FusePerfectScrollbarDirective } from '../directives/fuse-perfect-scrollbar/fuse-perfect-scrollbar.directive';
import { FuseIfOnDomDirective } from '../directives/fuse-if-on-dom/fuse-if-on-dom.directive';
import { FuseMaterialColorPickerComponent } from '../components/material-color-picker/material-color-picker.component';
import { FuseTranslationLoaderService } from '../services/translation-loader.service';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule } from '@ngx-translate/core';
import { CustomLoadingService } from '../../shared/custom-loading.service';
import { FCMService } from '../../shared/fcm.service';

@NgModule({
    declarations   : [
        FuseMatSidenavHelperDirective,
        FuseMatSidenavTogglerDirective,
        FuseConfirmDialogComponent,
        FuseCountdownComponent,
        FuseHljsComponent,
        FuseIfOnDomDirective,
        FusePerfectScrollbarDirective,
        FuseMaterialColorPickerComponent
    ],
    imports        : [
        FlexLayoutModule,
        MaterialModule,
        CommonModule,
        FormsModule,
        FusePipesModule,
        ReactiveFormsModule,
        ColorPickerModule,
        NgxDnDModule,
        NgxDatatableModule,
        NgSelectModule,
        TextMaskModule
    ],
    exports        : [
        FlexLayoutModule,
        MaterialModule,
        CommonModule,
        FormsModule,
        FuseMatSidenavHelperDirective,
        FuseMatSidenavTogglerDirective,
        FusePipesModule,
        FuseCountdownComponent,
        FuseHljsComponent,
        FusePerfectScrollbarDirective,
        ReactiveFormsModule,
        ColorPickerModule,
        NgxDnDModule,
        NgxDatatableModule,
        FuseIfOnDomDirective,
        FuseMaterialColorPickerComponent,
        TranslateModule,
        NgSelectModule,
        TextMaskModule
    ],
    entryComponents: [
        FuseConfirmDialogComponent
    ],
    providers      : [
        CookieService,
        FuseMatchMedia,
        FuseNavbarVerticalService,
        FuseMatSidenavHelperService,
        FuseTranslationLoaderService,
        CustomLoadingService,
        FCMService
    ]
})

export class SharedModule
{

}

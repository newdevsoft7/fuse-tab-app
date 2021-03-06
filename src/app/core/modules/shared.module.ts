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
import { NgPipesModule } from 'ngx-pipes';

import { FuseMatSidenavHelperDirective, FuseMatSidenavTogglerDirective } from '../directives/fuse-mat-sidenav-helper/fuse-mat-sidenav-helper.directive';
import { FuseMatSidenavHelperService } from '../directives/fuse-mat-sidenav-helper/fuse-mat-sidenav-helper.service';
import { FusePipesModule } from '../pipes/pipes.module';
import { FuseConfirmDialogComponent } from '../components/confirm-dialog/confirm-dialog.component';
import { FuseConfirmYesNoDialogComponent } from '../components/confirm-yes-no-dialog/confirm-yes-no-dialog.component';
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
import { MaterialTimeControlModule } from '../components/material-time-control/material-time-control.module';
import { ActionService } from '../../shared/services/action.service';
import { FCMService } from '../../shared/services/fcm.service';
import { SocketService } from '../../shared/services/socket.service';
import { FavicoService } from '../../shared/services/favico.service';
import { ActivityManagerService } from '../../shared/services/activity-manager.service';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { TokenStorage } from '../../shared/services/token-storage.service';
import { AuthGuardService } from '../../shared/guards/auth-guard.service';
import { UnauthGuardService } from '../../shared/guards/unauth-guard.service';
import { StarRatingModule } from 'angular-star-rating';
import { DebounceDirective } from '../directives/debounce/debounce.directive';
import { EditableTextComponent } from '../components/editable-text/editable-text.component';
import { RegistrationGuardService } from '../../shared/guards/registration-guard.service';
import { ConnectorService } from '../../shared/services/connector.service';
import { FuseInfoDialogComponent } from '../components/info-dialog/info-dialog.component';
import { FuseConfirmTextYesNoDialogComponent } from '../components/confirm-text-yes-no-dialog/confirm-text-yes-no-dialog.component';
import { SCMessageService } from '../../shared/services/sc-message.service';
import { NotExistGuardService } from '../../shared/guards/not-exist-guard.service';
import { FilterService } from '@shared/services/filter.service';
import { ScMouseWheelDirective } from '@shared/directives/sc-mouse-wheel.directive';

@NgModule({
    declarations   : [
        FuseMatSidenavHelperDirective,
        FuseMatSidenavTogglerDirective,
        FuseConfirmDialogComponent,
        FuseConfirmYesNoDialogComponent,
        FuseConfirmTextYesNoDialogComponent,
        FuseInfoDialogComponent,
        FuseCountdownComponent,
        FuseHljsComponent,
        FuseIfOnDomDirective,
        FusePerfectScrollbarDirective,
        DebounceDirective,
        FuseMaterialColorPickerComponent,
        EditableTextComponent,
        ScMouseWheelDirective
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
        TextMaskModule,
        MaterialTimeControlModule,
        NgPipesModule,
        StarRatingModule.forRoot()
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
        DebounceDirective,
        ReactiveFormsModule,
        ColorPickerModule,
        NgxDnDModule,
        NgxDatatableModule,
        FuseIfOnDomDirective,
        FuseMaterialColorPickerComponent,
        TranslateModule,
        NgSelectModule,
        TextMaskModule,
        MaterialTimeControlModule,
        NgPipesModule,
        StarRatingModule,
        EditableTextComponent,
        ScMouseWheelDirective
    ],
    entryComponents: [
        FuseConfirmDialogComponent,
        FuseConfirmYesNoDialogComponent,
        FuseConfirmTextYesNoDialogComponent,
        FuseInfoDialogComponent
    ],
    providers      : [
        CookieService,
        FuseMatchMedia,
        FuseNavbarVerticalService,
        FuseMatSidenavHelperService,
        FuseTranslationLoaderService,
        FCMService,
        SocketService,
        FavicoService,
        ActivityManagerService,
        ActionService,
        AuthenticationService,
        TokenStorage,
        ConnectorService,
        FilterService,
        // guards
        AuthGuardService,
        UnauthGuardService,
        RegistrationGuardService,
        NotExistGuardService,
        SCMessageService
    ]
})

export class SharedModule
{

}

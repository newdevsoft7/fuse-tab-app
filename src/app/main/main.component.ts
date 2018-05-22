import { Component, ElementRef, HostBinding, Inject, OnDestroy, OnInit, Renderer2, ViewEncapsulation } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FuseConfigService } from '../core/services/config.service';
import { Platform } from '@angular/cdk/platform';
import { DOCUMENT } from '@angular/common';
import { CustomLoadingService } from '../shared/services/custom-loading.service';
import { AuthenticationService } from '../shared/services/authentication.service';
import { TokenStorage } from '../shared/services/token-storage.service';

@Component({
    selector     : 'fuse-main',
    templateUrl  : './main.component.html',
    styleUrls    : ['./main.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class FuseMainComponent implements OnInit, OnDestroy
{
    onSettingsChanged: Subscription;
    fuseSettings: any;
    @HostBinding('attr.fuse-layout-mode') layoutMode;

    constructor(
        private _renderer: Renderer2,
        private _elementRef: ElementRef,
        private fuseConfig: FuseConfigService,
        private platform: Platform,
        private authService: AuthenticationService,
        private tokenStorage: TokenStorage,
        @Inject(DOCUMENT) private document: any
    )
    {
        this.onSettingsChanged =
            this.fuseConfig.onSettingsChanged
                .subscribe(
                    (newSettings) => {
                        this.fuseSettings = newSettings;
                        this.layoutMode = this.fuseSettings.layout.mode;
                    }
                );

        if ( this.platform.ANDROID || this.platform.IOS )
        {
            this.document.body.className += ' is-mobile';
        }
    }

    ngOnInit()
    {
    }

    ngOnDestroy()
    {
        this.onSettingsChanged.unsubscribe();
    }

    addClass(className: string)
    {
        this._renderer.addClass(this._elementRef.nativeElement, className);
    }

    removeClass(className: string)
    {
        this._renderer.removeClass(this._elementRef.nativeElement, className);
    }

    get visibleNavbar(): boolean {
        return this.authService.isAuthorized() && this.tokenStorage.getUser().lvl.indexOf('registrant') === -1;
    }

    get visibleToolbar(): boolean {
       return this.authService.isAuthorized() && this.tokenStorage.getUser().lvl.indexOf('registrant') === -1;
    }

    get requiredFormData(): boolean {
        return !!this.tokenStorage.getFormData();
    }
}

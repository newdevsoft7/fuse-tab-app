import { Component, OnInit, OnDestroy } from '@angular/core';
import { NavigationEnd, NavigationStart, Router } from '@angular/router';
import { FuseConfigService } from '../../core/services/config.service';
import { TranslateService } from '@ngx-translate/core';
import { TabService } from '../tab/tab.service';
import { USERS_PROFILE_TAB } from '../../constants/tab';
import { AuthenticationService } from '../../shared/services/authentication.service';
import { UserService } from '../content/users/user.service';
import { TokenStorage } from '../../shared/services/token-storage.service';
import { fuseAnimations } from '../../core/animations';
import { Tab } from '../tab/tab';
import { Subscription } from 'rxjs/Subscription';
import { UsersChatService } from '../content/users/chat/chat.service';
import * as TAB from '../../constants/tab';

@Component({
    selector   : 'fuse-toolbar',
    templateUrl: './toolbar.component.html',
    styleUrls  : ['./toolbar.component.scss'],
    animations: fuseAnimations
})

export class FuseToolbarComponent implements OnInit, OnDestroy
{
    userStatusOptions: any[];
    languages: any;
    selectedLanguage: any;
    showLoadingBar: boolean;
    horizontalNav: boolean;

    user: any;

    loggedInSecondary: boolean = false;

    userSwitcherSubscription: Subscription;

    constructor(
        private router: Router,
        private fuseConfig: FuseConfigService,
        private translate: TranslateService,
        private tabService: TabService,
        private authService: AuthenticationService,
        private userService: UserService,
        private tokenStorage: TokenStorage,
        private userChatService: UsersChatService
    )
    {
        this.userStatusOptions = [
            {
                'title': 'Online',
                'icon' : 'icon-checkbox-marked-circle',
                'color': '#4CAF50'
            },
            {
                'title': 'Away',
                'icon' : 'icon-clock',
                'color': '#FFC107'
            },
            {
                'title': 'Do not Disturb',
                'icon' : 'icon-minus-circle',
                'color': '#F44336'
            },
            {
                'title': 'Invisible',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#BDBDBD'
            },
            {
                'title': 'Offline',
                'icon' : 'icon-checkbox-blank-circle-outline',
                'color': '#616161'
            }
        ];

        this.languages = [
            {
                'id'   : 'en',
                'title': 'English',
                'flag' : 'us'
            },
            {
                'id'   : 'tr',
                'title': 'Turkish',
                'flag' : 'tr'
            }
        ];

        this.selectedLanguage = this.languages[0];

        router.events.subscribe(
            (event) => {
                if ( event instanceof NavigationStart )
                {
                    this.showLoadingBar = true;
                }
                if ( event instanceof NavigationEnd )
                {
                    this.showLoadingBar = false;
                }
            });

        this.fuseConfig.onSettingsChanged.subscribe((settings) => {
            this.horizontalNav = settings.layout.navigation === 'top';
        });

    }

    ngOnInit() {
        this.switchUser();
        this.userSwitcherSubscription = this.tokenStorage.userSwitchListener.subscribe((isSwitch: boolean) => {
            if (isSwitch) {
                this.switchUser();
            }
        });
    }

    ngOnDestroy() {
        if (this.userSwitcherSubscription) {
            this.userSwitcherSubscription.unsubscribe();
        }
    }

    async switchUser() {
        const user = this.tokenStorage.getUser();
        if (user) {
            try {
                this.user = await this.userService.getUser(user.id).toPromise();            
                if (this.tokenStorage.isExistSecondaryUser()) {
                    this.loggedInSecondary = true;
                } else {
                    this.loggedInSecondary = false;
                }
            } catch (e) {}
        }
    }

    search(value)
    {
        // Do your search here...
        console.log(value);
    }

    setLanguage(lang)
    {
        // Set the selected language for toolbar
        this.selectedLanguage = lang;

        // Use the selected language for translations
        this.translate.use(lang.id);
    }

    logout() {
        this.authService.logout();
    }

    openProfile() {
        const tab = new Tab(`${this.user.fname} ${this.user.lname}`, 'usersProfileTpl', `users/user/${this.user.id}`, this.user);
        this.tabService.openTab(tab);
    }

    get unreadCount(): number {
        return (this.userChatService.unreadList.length + this.userChatService.unreadThreads.length);
    }

    showChatTab() {
        this.tabService.openTab(TAB.USERS_CHAT_TAB);
    }

    get requiredFormData(): boolean {
        return !!this.tokenStorage.getFormData();
    }
}

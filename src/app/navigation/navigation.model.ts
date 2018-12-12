import { FuseNavigationModelInterface } from '../core/components/navigation/navigation.model';
import { TAB } from '../constants/tab';
import { Level } from '../constants/level';

export const ADMIN_MODEL = [
    {
        'id': 'users',
        'title': 'Users',
        'translate': 'NAV.ADMIN.USERS',
        'type': 'collapse',
        'icon': 'people',
        'tab': TAB.USERS_TAB,
        'children': [
            {
                'id': 'new_message',
                'title': 'New Message',
                'translate': 'NAV.ADMIN.USERS_NEW_MESSAGE',
                'type': 'item',
                'tab': TAB.USERS_NEW_MESSAGE_TAB

            },
            {
                'id': 'cards',
                'title': 'Cards',
                'translate': 'NAV.ADMIN.USERS_CARDS',
                'type': 'item',
                'tab': TAB.USERS_CARDS

            },
            {
                'id': 'presentations',
                'title': 'Presentations',
                'translate': 'NAV.ADMIN.USERS_PRESENTATIONS',
                'type': 'item',
                'tab': TAB.USERS_PRESENTATIONS_TAB

            }
        ]
    },
    {
        'id': 'clients',
        'title': 'Clients',
        'translate': 'NAV.ADMIN.CLIENTS',
        'type': 'item',
        'icon': 'people',
        'tab': TAB.CLIENTS_TAB
    },
    {
        'id': 'client_invoices',
        'title': 'Client Invoices',
        'translate': 'NAV.ADMIN.CLIENT_INVOICES',
        'type': 'collapse',
        'icon': 'account_balance',
        'tab': TAB.CLIENT_INVOICES_TAB,
        'children': [
            {
                'id': 'generate_client_invoice',
                'title': 'Generate Client Invoice',
                'translate': 'NAV.ADMIN.CLIENT_INVOICE_GENERATE',
                'type': 'item',
                'tab': TAB.CLIENT_INVOICE_GENERATE_TAB
            }
        ]
    },
    {
        'id': 'outsource_companies',
        'title': 'Outsource Companies',
        'translate': 'NAV.ADMIN.OUTSOURCE_COMPANIES',
        'type': 'item',
        'icon': 'domain',
        'tab': TAB.OUTSOURCE_COMPANIES_TAB
    },
    {
        'id': 'schedule',
        'title': 'Schedule',
        'translate': 'NAV.ADMIN.SCHEDULE',
        'type': 'collapse',
        'icon': 'schedule',
        'tab': TAB.SCHEDULE_CALENDAR_TAB,
        'children': [
            {
                'id': 'calendar',
                'title': 'Calendar',
                'translate': 'NAV.ADMIN.SCHEDULE_CALENDAR',
                'type': 'item',
                'tab': TAB.SCHEDULE_CALENDAR_TAB

            },
            {
                'id': 'list',
                'title': 'List',
                'translate': 'NAV.ADMIN.SCHEDULE_LIST',
                'type': 'item',
                'tab': TAB.SCHEDULE_ADMIN_LIST_TAB
            },
            {
                'id': 'import_shifts',
                'title': 'Import Shifts',
                'translate': 'NAV.ADMIN.SCHEDULE_IMPORT_SHIFTS',
                'type': 'collapse',
                'tab': TAB.SCHEDULE_IMPORT_SHIFTS_TAB,
                'children': [
                    {
                        'id': 'import_history',
                        'title': 'Import History',
                        'translate': 'NAV.ADMIN.SCHEDULE_IMPORT_SHIFTS_IMPORT_HISTORY',
                        'type': 'item',
                        'tab': TAB.SCHEDULE_IMPORT_SHIFTS_IMPORT_HISTORY_TAB
                    },
                    {
                        'id': 'column_mapping',
                        'title': 'Column Mapping',
                        'translate': 'NAV.ADMIN.SCHEDULE_IMPORT_SHIFTS_COLUMN_MAPPING',
                        'type': 'item',
                        'tab': TAB.SCHEDULE_IMPORT_SHIFTS_COLUMN_MAPPING_TAB
                    }
                ]
            },
            {
                'id': 'export_shifts',
                'title': 'Export Shifts',
                'translate': 'NAV.ADMIN.SCHEDULE_EXPORT_SHIFTS',
                'type': 'collapse',
                'children': []
            },
            {
                'id': 'new_shift',
                'title': 'New Shift',
                'translate': 'NAV.ADMIN.SCHEDULE_NEW_SHIFT',
                'type': 'item',
                'tab': TAB.SCHEDULE_NEW_SHIFT_TAB
            }
        ]
    },
    {
        'id': 'reports_and_uploads',
        'title': 'Reports & Uploads',
        'translate': 'NAV.ADMIN.REPORTS_AND_UPLOADS',
        'type': 'collapse',
        'icon': 'cloud_upload',
        'tab': TAB.REPORTS_AND_UPLOADS_TAB,
        'children': [
            {
                'id': 'quizs',
                'title': 'Quizzes',
                'translate': 'NAV.ADMIN.QUIZS',
                'type': 'item',
                'tab': TAB.QUIZS_TAB
            },
            {
                'id': 'surveys',
                'title': 'Surveys',
                'translate': 'NAV.ADMIN.SURVEYS',
                'type': 'item',
                'tab': TAB.SURVEYS_TAB
            }
        ]
    },
    // {
    //     'id': 'accounting',
    //     'title': 'Accounting',
    //     'translate': 'NAV.ADMIN.ACCOUNTING',
    //     'type': 'item',
    //     'icon': 'attach_money',
    //     'tab': TAB.ACCOUNTING_TAB,
    // },
    {
        'id': 'tracking',
        'title': 'Tracking',
        'translate': 'NAV.ADMIN.TRACKING',
        'type': 'collapse',
        'icon': 'dashboard'
    },
    {
        'id': 'settings',
        'title': 'Settings',
        'translate': 'NAV.ADMIN.SETTINGS',
        'type': 'collapse',
        'icon': 'settings',
        'tab': TAB.SETTINGS_TAB,
        'children': [
            {
                'id': 'templates',
                'title': 'Templates',
                'translate': 'NAV.ADMIN.SETTINGS_TEMPLATES',
                'type': 'collapse',
                'children': [
                    {
                        'id': 'email',
                        'title': 'Email',
                        'translate': 'NAV.ADMIN.SETTINGS_TEMPLATES_EMAIL',
                        'type': 'item',
                        'tab': TAB.SETTINGS_TEMPLATES_EMAIL_TAB
                    },
                    {
                        'id': 'shift_notes',
                        'title': 'Shift Notes',
                        'translate': 'NAV.ADMIN.SETTINGS_TEMPLATES_SHIFT_NOTES',
                        'type': 'item',
                        'tab': TAB.SETTINGS_TEMPLATES_SHIFT_NOTES_TAB
                    }
                ]
            },
        ]
    },
    {
        'id': 'summary',
        'title': 'Summary',
        'translate': 'NAV.ADMIN.SUMMARY',
        'type': 'item',
        'icon': 'note',
        'tab': TAB.SUMMARY_TAB,
    }
];

export const STAFF_MODEL = [
    {
        'id': 'calendar',
        'title': 'Calendar',
        'translate': 'NAV.STAFF.CALENDAR',
        'icon': 'today',
        'type': 'item',
        'tab': TAB.SCHEDULE_CALENDAR_TAB
    },
];

export const CLIENT_MODEL = [
    {
        'id': 'schedule',
        'title': 'Schedule',
        'translate': 'NAV.ADMIN.SCHEDULE',
        'type': 'collapse',
        'icon': 'schedule',
        'children': [
            {
                'id': 'calendar',
                'title': 'Calendar',
                'translate': 'NAV.ADMIN.SCHEDULE_CALENDAR',
                'type': 'item',
                'tab': TAB.SCHEDULE_CALENDAR_TAB

            },
            {
                'id': 'list',
                'title': 'List',
                'translate': 'NAV.ADMIN.SCHEDULE_LIST',
                'type': 'item',
                'tab': TAB.SCHEDULE_CLIENT_LIST_TAB
            },
            {
                'id': 'export_shifts',
                'title': 'Export Shifts',
                'translate': 'NAV.ADMIN.SCHEDULE_EXPORT_SHIFTS',
                'type': 'collapse',
                'children': []
            },
            {
                'id': 'new_booking',
                'title': 'New Booking',
                'translate': 'NAV.CLIENT.NEW_BOOKING',
                'type': 'item',
                'tab': TAB.CLIENT_NEW_BOOKING_TAB
            }
        ]
    },
    {
        'id': 'reports',
        'title': 'Repports',
        'translate': 'NAV.CLIENT.REPORTS',
        'type': 'item',
        'icon': 'schedule'
    }
];

export class FuseNavigationModel implements FuseNavigationModelInterface {
    public model: any[];

    constructor(level = Level.Admin) {
        switch (level) {
            case Level.Owner:
            case Level.Admin:
                this.model = ADMIN_MODEL;
                break;

            case Level.Client:
                this.model = CLIENT_MODEL;
                break;

            default:
                this.model = STAFF_MODEL;
                break;
        }

    }
}

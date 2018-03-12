import { FuseNavigationModelInterface } from '../core/components/navigation/navigation.model';
import * as TAB from '../constants/tab';
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
                'id': 'presentations',
                'title': 'Presentations',
                'translate': 'NAV.ADMIN.USERS_PRESENTATIONS',
                'type': 'item',
                'tab': TAB.USERS_PRESENTATIONS_TAB

            },
            {
                'id': 'new_submission',
                'title': 'New Submission',
                'translate': 'NAV.ADMIN.USERS_NEW_SUBMISSION',
                'type': 'item',
                'tab': TAB.USERS_NEW_SUBMISSION_TAB

            },
            {
                'id': 'recent_activity',
                'title': 'Recent Activity',
                'translate': 'NAV.ADMIN.USERS_RECENT_ACTIVITY',
                'type': 'item',
                'tab': TAB.USERS_RECENT_ACTIVITY_TAB

            },
            {
                'id': 'new_message',
                'title': 'New Message',
                'translate': 'NAV.ADMIN.USERS_NEW_MESSAGE',
                'type': 'item',
                'tab': TAB.USERS_NEW_MESSAGE_TAB

            },
            {
                'id': 'chat',
                'title': 'Chat',
                'translate': 'NAV.ADMIN.USERS_CHAT',
                'type': 'item',
                'tab': TAB.USERS_CHAT_TAB

            }
        ]
    },
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
                // 'tab': TAB.SCHEDULE_EXPORT_SHIFTS_TAB,
                'children': [
                    {
                        'id': 'excel_spreadsheet',
                        'title': 'Excel Spreadsheet',
                        'translate': 'NAV.ADMIN.SCHEDULE_EXPORT_SHIFTS_EXCEL_SPREADSHEET',
                        'type': 'item',
                        'tab': TAB.SCHEDULE_EXPORT_SHIFTS_EXCEL_SPREADSHEET_TAB
                    },
                    {
                        'id': 'pdf_overview',
                        'title': 'PDF Overview',
                        'translate': 'NAV.ADMIN.SCHEDULE_EXPORT_SHIFTS_PDF_OVERVIEW',
                        'type': 'item',
                        'tab': TAB.SCHEDULE_EXPORT_SHIFTS_PDF_OVERVIEW_TAB
                    }
                ]
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
                'id': 'report_designer',
                'title': 'Report Designer',
                'translate': 'NAV.ADMIN.REPORTS_AND_UPLOADS_REPORT_DESIGNER',
                'type': 'item',
                'tab': TAB.REPORTS_AND_UPLOADS_REPORT_DESIGNER_TAB

            },
            {
                'id': 'shared_files',
                'title': 'Shared Files',
                'translate': 'NAV.ADMIN.REPORTS_AND_UPLOADS_SHARED_FILES',
                'type': 'item',
                'tab': TAB.REPORTS_AND_UPLOADS_SHARED_FILES_TAB

            }
        ]
    },
    {
        'id': 'accounting',
        'title': 'Accounting',
        'translate': 'NAV.ADMIN.ACCOUNTING',
        'type': 'collapse',
        'icon': 'attach_money',
        'tab': TAB.ACCOUNTING_TAB,
        'children': [
            {
                'id': 'staff_invoices',
                'title': 'Staff Invoices',
                'translate': 'NAV.ADMIN.ACCOUNTING_STAFF_INVOICES',
                'type': 'collapse',
                'tab': TAB.ACCOUNTING_STAFF_INVOICES_TAB,
                'children': [
                    {
                        'id': 'generate_staff_invoices',
                        'title': 'Generate Staff Invoices',
                        'translate': 'NAV.ADMIN.ACCOUNTING_STAFF_INVOICES_GENERATE_STAFF_INVOICES',
                        'type': 'item',
                        'tab': TAB.ACCOUNTING_STAFF_INVOICES_GENERATE_STAFF_INVOICES_TAB
                    },
                    {
                        'id': 'my_invoices',
                        'title': 'My Invoices',
                        'translate': 'NAV.ADMIN.ACCOUNTING_STAFF_INVOICES_MY_INVOICES',
                        'type': 'collapse',
                        'tab': TAB.ACCOUNTING_STAFF_INVOICES_MY_INVOICES_TAB,
                        'children': [
                            {
                                'id': 'new_invoice',
                                'title': 'New Invoice',
                                'translate': 'NAV.ADMIN.ACCOUNTING_STAFF_INVOICES_MY_INVOICES_NEW_INVOICE',
                                'type': 'item',
                                'tab': TAB.ACCOUNTING_STAFF_INVOICES_MY_INVOICES_NEW_INVOICE_TAB
                            }
                        ]
                    }
                ]
            }
        ]
    },
    {
        'id': 'tracking',
        'title': 'Tracking',
        'translate': 'NAV.ADMIN.TRACKING',
        'type': 'collapse',
        'icon': 'dashboard',
        'tab': TAB.TRACKING_TAB
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
                'id': 'profile',
                'title': 'Profile',
                'translate': 'NAV.ADMIN.SETTINGS_PROFILE',
                'type': 'collapse',
                'tab': TAB.SETTINGS_PROFILE_TAB,
                'children': [
                    {
                        'id': 'attributes',
                        'title': 'Attributes',
                        'translate': 'NAV.ADMIN.SETTINGS_PROFILE_ATTRIBUTES',
                        'type': 'item',
                        'tab': TAB.SETTINGS_PROFILE_ATTRIBUTES_TAB
                    },
                    {
                        'id': 'document_categories',
                        'title': 'Document Categories',
                        'translate': 'NAV.ADMIN.SETTINGS_PROFILE_DOCUMENT_CATEGORIES',
                        'type': 'item',
                        'tab': TAB.SETTINGS_PROFILE_DOCUMENT_CATEGORIES_TAB
                    },
                    {
                        'id': 'experience',
                        'title': 'Experience',
                        'translate': 'NAV.ADMIN.SETTINGS_PROFILE_EXPERIENCE',
                        'type': 'item',
                        'tab': TAB.SETTINGS_PROFILE_EXPERIENCE_TAB
                    },
                    {
                        'id': 'info',
                        'title': 'Info',
                        'translate': 'NAV.ADMIN.SETTINGS_PROFILE_INFO',
                        'type': 'item',
                        'tab': TAB.SETTINGS_PROFILE_INFO_TAB
                    },
                    {
                        'id': 'photo_categories',
                        'title': 'Photo Categories',
                        'translate': 'NAV.ADMIN.SETTINGS_PROFILE_PHOTO_CATEGORIES',
                        'type': 'item',
                        'tab': TAB.SETTINGS_PROFILE_PHOTO_CATEGORIES_TAB
                    },
                    {
                        'id': 'ratings',
                        'title': 'Ratings',
                        'translate': 'NAV.ADMIN.SETTINGS_PROFILE_RATINGS',
                        'type': 'item',
                        'tab': TAB.SETTINGS_PROFILE_RATINGS_TAB
                    },
                    {
                        'id': 'showcases',
                        'title': 'Showcases',
                        'translate': 'NAV.ADMIN.SETTINGS_PROFILE_SHOWCASES',
                        'type': 'item',
                        'tab': TAB.SETTINGS_PROFILE_SHOWCASES_TAB
                    },
                    {
                        'id': 'video_categories',
                        'title': 'Video Categories',
                        'translate': 'NAV.ADMIN.SETTINGS_PROFILE_VIDEO_CATEGORIES',
                        'type': 'item',
                        'tab': TAB.SETTINGS_PROFILE_VIDEO_CATEGORIES_TAB
                    }
                ]
            },
            {
                'id': 'system',
                'title': 'System',
                'translate': 'NAV.ADMIN.SETTINGS_SYSTEM',
                'type': 'item',
                'tab': TAB.SETTINGS_SYSTEM_TAB
            },
            {
                'id': 'templates',
                'title': 'Templates',
                'translate': 'NAV.ADMIN.SETTINGS_TEMPLATES',
                'type': 'collapse',
                'tab': TAB.SETTINGS_TEMPLATES_TAB,
                'children': [
                    {
                        'id': 'email',
                        'title': 'Email',
                        'translate': 'NAV.ADMIN.SETTINGS_TEMPLATES_EMAIL',
                        'type': 'item',
                        'tab': TAB.SETTINGS_TEMPLATES_EMAIL_TAB
                    },
                    {
                        'id': 'email_attachments',
                        'title': 'Email Attachments',
                        'translate': 'NAV.ADMIN.SETTINGS_TEMPLATES_EMAIL_ATTACHMENTS',
                        'type': 'item',
                        'tab': TAB.SETTINGS_TEMPLATES_EMAIL_ATTACHMENTS_TAB
                    },
                    {
                        'id': 'sms',
                        'title': 'SMS',
                        'translate': 'NAV.ADMIN.SETTINGS_TEMPLATES_SMS',
                        'type': 'item',
                        'tab': TAB.SETTINGS_TEMPLATES_SMS_TAB
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
            {
                'id': 'help',
                'title': 'Help',
                'translate': 'NAV.ADMIN.SETTINGS_HELP',
                'type': 'collapse',
                'tab': TAB.SETTINGS_HELP_TAB,
                'children': [
                    {
                        'id': 'quickstart_guide',
                        'title': 'QuickStart Guide',
                        'translate': 'NAV.ADMIN.SETTINGS_HELP_QUICKSTART_GUIDE',
                        'type': 'item',
                        'tab': TAB.SETTINGS_HELP_QUICKSTART_GUIDE_TAB
                    },
                    {
                        'id': 'video_system_setup',
                        'title': 'Video - System Setup',
                        'translate': 'NAV.ADMIN.SETTINGS_HELP_VIDEO_SYSTEM_SETUP',
                        'type': 'item',
                        'tab': TAB.SETTINGS_HELP_VIDEO_SYSTEM_SETUP_TAB
                    },
                    {
                        'id': 'video_scheduling',
                        'title': 'Video Scheduling',
                        'translate': 'NAV.ADMIN.SETTINGS_HELP_VIDEO_SCHEDULING',
                        'type': 'item',
                        'tab': TAB.SETTINGS_HELP_VIDEO_SCHEDULING_TAB
                    },
                    {
                        'id': 'updates_and_changelog',
                        'title': 'Updates & Changelog',
                        'translate': 'NAV.ADMIN.SETTINGS_HELP_UPDATES_CHANGELOG',
                        'type': 'item',
                        'tab': TAB.SETTINGS_HELP_UPDATES_CHANGELOG_TAB
                    }
                ]
            }
        ]
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
    {
        'id': 'invoices',
        'title': 'Invoices',
        'translate': 'NAV.STAFF.INVOICES',
        'type': 'collapse',
        'icon': 'attach_money',
        'tab': TAB.STAFF_INVOICES_TAB,
        'children': [
            {
                'id': 'new_invoice',
                'title': 'New Invoice',
                'translate': 'NAV.STAFF.NEW_INVOICE',
                'type': 'item',
                'tab': TAB.STAFF_NEW_INVOICE_TAB
            }
        ]
    },
    {
        'id': 'help',
        'title': 'Help',
        'translate': 'NAV.STAFF.HELP',
        'type': 'collapse',
        'icon': 'help',
        'children': [
            {
                'id': 'quickstart_guide',
                'title': 'QuickStart Guide',
                'translate': 'NAV.STAFF.QUICKSTART_GUIDE',
                'type': 'item',
                'tab': TAB.SETTINGS_HELP_QUICKSTART_GUIDE_TAB
            }
        ]
    }

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

export class FuseNavigationModel implements FuseNavigationModelInterface
{
    public model: any[];

    constructor(level = Level.Admin)
    {
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

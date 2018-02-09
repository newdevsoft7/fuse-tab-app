import { FuseNavigationModelInterface } from '../core/components/navigation/navigation.model';
import * as TAB from '../constants/tab';

export class FuseNavigationModel implements FuseNavigationModelInterface
{
    public model: any[];

    constructor()
    {
        this.model = [
            {
                'id'      : 'users',
                'title'   : 'Users',
                'translate': 'NAV.USERS',
                'type'    : 'collapse',
                'icon': 'people',
                'tab'   : TAB.USERS_TAB,
                'children': [
                    {
                        'id'   : 'export',
                        'title': 'Export',
                        'translate': 'NAV.USERS_EXPORT',
                        'type' : 'item',
                        'tab': TAB.USERS_EXPORTS_TAB
                    },
                    {
                        'id': 'presentations',
                        'title': 'Presentations',
                        'translate': 'NAV.USERS_PRESENTATIONS',
                        'type': 'item',
                        'tab': TAB.USERS_PRESENTATIONS_TAB
                        
                    },
                    {
                        'id': 'new_submission',
                        'title': 'New Submission',
                        'translate': 'NAV.USERS_NEW_SUBMISSION',
                        'type': 'item',
                        'tab': TAB.USERS_NEW_SUBMISSION_TAB

                    },
                    {
                        'id': 'new_user',
                        'title': 'New User',
                        'translate': 'NAV.USERS_NEW_USER',
                        'type': 'item',
                        'tab': TAB.USERS_NEW_USER_TAB

                    },
                    {
                        'id': 'recent_activity',
                        'title': 'Recent Activity',
                        'translate': 'NAV.USERS_RECENT_ACTIVITY',
                        'type': 'item',
                        'tab': TAB.USERS_RECENT_ACTIVITY_TAB

                    },
                    {
                        'id': 'new_message',
                        'title': 'New Message',
                        'translate': 'NAV.USERS_NEW_MESSAGE',
                        'type': 'item',
                        'tab': TAB.USERS_NEW_MESSAGE_TAB

                    }
                ]
            },
            {
                'id': 'schedule',
                'title': 'Schedule',
                'translate': 'NAV.SCHEDULE',
                'type': 'collapse',
                'icon': 'schedule',
                'tab': TAB.SCHEDULE_TAB,
                'children': [
                    {
                        'id': 'calendar',
                        'title': 'Calendar',
                        'translate': 'NAV.SCHEDULE_CALENDAR',
                        'type': 'item',
                        'tab'  : TAB.SCHEDULE_CALENDAR_TAB
                        
                    },
                    {
                        'id': 'list',
                        'title': 'List',
                        'translate': 'NAV.SCHEDULE_LIST',
                        'type': 'item',
                        'tab': TAB.SCHEDULE_LIST_TAB
                    },
                    {
                        'id': 'import_shifts',
                        'title': 'Import Shifts',
                        'translate': 'NAV.SCHEDULE_IMPORT_SHIFTS',
                        'type': 'collapse',
                        'tab': TAB.SCHEDULE_IMPORT_SHIFTS_TAB,
                        'children': [
                            {
                                'id': 'import_history',
                                'title': 'Import History',
                                'translate': 'NAV.SCHEDULE_IMPORT_SHIFTS_IMPORT_HISTORY',
                                'type': 'item',
                                'tab': TAB.SCHEDULE_IMPORT_SHIFTS_IMPORT_HISTORY_TAB
                            },
                            {
                                'id': 'column_mapping',
                                'title': 'Column Mapping',
                                'translate': 'NAV.SCHEDULE_IMPORT_SHIFTS_COLUMN_MAPPING',
                                'type': 'item',
                                'tab': TAB.SCHEDULE_IMPORT_SHIFTS_COLUMN_MAPPING_TAB
                            }
                        ]
                    },
                    {
                        'id': 'export_shifts',
                        'title': 'Export Shifts',
                        'translate': 'NAV.SCHEDULE_EXPORT_SHIFTS',
                        'type': 'collapse',
                        'tab': TAB.SCHEDULE_EXPORT_SHIFTS_TAB,
                        'children': [
                            {
                                'id': 'excel_spreadsheet',
                                'title': 'Excel Spreadsheet',
                                'translate': 'NAV.SCHEDULE_EXPORT_SHIFTS_EXCEL_SPREADSHEET',
                                'type': 'item',
                                'tab': TAB.SCHEDULE_EXPORT_SHIFTS_EXCEL_SPREADSHEET_TAB
                            },
                            {
                                'id': 'pdf_overview',
                                'title': 'PDF Overview',
                                'translate': 'NAV.SCHEDULE_EXPORT_SHIFTS_PDF_OVERVIEW',
                                'type': 'item',
                                'tab': TAB.SCHEDULE_EXPORT_SHIFTS_PDF_OVERVIEW_TAB
                            }
                        ]
                    },
                    {
                        'id': 'new_shift',
                        'title': 'New Shift',
                        'translate': 'NAV.SCHEDULE_NEW_SHIFT',
                        'type': 'item',
                        'tab': TAB.SCHEDULE_NEW_SHIFT_TAB
                    }
                ]
            },
            {
                'id': 'reports_and_uploads',
                'title': 'Reports & Uploads',
                'translate': 'NAV.REPORTS_AND_UPLOADS',
                'type': 'collapse',
                'icon': 'cloud_upload',
                'tab': TAB.REPORTS_AND_UPLOADS_TAB,
                'children': [
                    {
                        'id': 'report_designer',
                        'title': 'Report Designer',
                        'translate': 'NAV.REPORTS_AND_UPLOADS_REPORT_DESIGNER',
                        'type': 'item',
                        'tab': TAB.REPORTS_AND_UPLOADS_REPORT_DESIGNER_TAB

                    },
                    {
                        'id': 'shared_files',
                        'title': 'Shared Files',
                        'translate': 'NAV.REPORTS_AND_UPLOADS_SHARED_FILES',
                        'type': 'item',
                        'tab': TAB.REPORTS_AND_UPLOADS_SHARED_FILES_TAB

                    }
                ]
            },
            {
                'id': 'accounting',
                'title': 'Accounting',
                'translate': 'NAV.ACCOUNTING',
                'type': 'collapse',
                'icon': 'attach_money',
                'tab': TAB.ACCOUNTING_TAB,
                'children': [
                    {
                        'id': 'staff_invoices',
                        'title': 'Staff Invoices',
                        'translate': 'NAV.ACCOUNTING_STAFF_INVOICES',
                        'type': 'collapse',
                        'tab': TAB.ACCOUNTING_STAFF_INVOICES_TAB,
                        'children': [
                            {
                                'id': 'generate_staff_invoices',
                                'title': 'Generate Staff Invoices',
                                'translate': 'NAV.ACCOUNTING_STAFF_INVOICES_GENERATE_STAFF_INVOICES',
                                'type': 'item',
                                'tab': TAB.ACCOUNTING_STAFF_INVOICES_GENERATE_STAFF_INVOICES_TAB
                            },
                            {
                                'id': 'my_invoices',
                                'title': 'My Invoices',
                                'translate': 'NAV.ACCOUNTING_STAFF_INVOICES_MY_INVOICES',
                                'type': 'collapse',
                                'tab': TAB.ACCOUNTING_STAFF_INVOICES_MY_INVOICES_TAB,
                                'children': [
                                    {
                                        'id': 'new_invoice',
                                        'title': 'New Invoice',
                                        'translate': 'NAV.ACCOUNTING_STAFF_INVOICES_MY_INVOICES_NEW_INVOICE',
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
                'translate': 'NAV.TRACKING',
                'type': 'collapse',
                'icon': 'dashboard',
                'tab': TAB.TRACKING_TAB,
                // 'children': [
                //     {
                //         'id': 'brand',
                //         'title': 'Brand',
                //         'translate': 'NAV.TRACKING_BRAND',
                //         'type': 'item',
                //         'tab': TAB.TRACKING_BRAND_TAB
                //     },
                //     {
                //         'id': 'campaign',
                //         'title': 'Campaign',
                //         'translate': 'NAV.TRACKING_CAMPAIGN',
                //         'type': 'item',
                //         'tab': TAB.TRACKING_CAMPAIGN_TAB
                //     },
                //     {
                //         'id': 'job_number',
                //         'title': 'Job Number',
                //         'translate': 'NAV.TRACKING_JOB_NUMBER',
                //         'type': 'item',
                //         'tab': TAB.TRACKING_JOB_NUMBER_TAB
                //     },
                //     {
                //         'id': 'po_number',
                //         'title': 'PO Number',
                //         'translate': 'NAV.TRACKING_PO_NUMBER',
                //         'type': 'item',
                //         'tab': TAB.TRACKING_PO_NUMBER_TAB
                //     },
                //     {
                //         'id': 'test',
                //         'title': 'Test',
                //         'translate': 'NAV.TRACKING_TEST',
                //         'type': 'item',
                //         'tab': TAB.TRACKING_TEST_TAB
                //     }
                // ]
            },
            {
                'id': 'settings',
                'title': 'Settings',
                'translate': 'NAV.SETTINGS',
                'type': 'collapse',
                'icon': 'settings',
                'tab': TAB.SETTINGS_TAB,
                'children': [
                    {
                        'id': 'profile',
                        'title': 'Profile',
                        'translate': 'NAV.SETTINGS_PROFILE',
                        'type': 'collapse',
                        'tab': TAB.SETTINGS_PROFILE_TAB,
                        'children': [
                            {
                                'id': 'attributes',
                                'title': 'Attributes',
                                'translate': 'NAV.SETTINGS_PROFILE_ATTRIBUTES',
                                'type': 'item',
                                'tab': TAB.SETTINGS_PROFILE_ATTRIBUTES_TAB
                            },
                            {
                                'id': 'document_categories',
                                'title': 'Document Categories',
                                'translate': 'NAV.SETTINGS_PROFILE_DOCUMENT_CATEGORIES',
                                'type': 'item',
                                'tab': TAB.SETTINGS_PROFILE_DOCUMENT_CATEGORIES_TAB
                            },
                            {
                                'id': 'experience',
                                'title': 'Experience',
                                'translate': 'NAV.SETTINGS_PROFILE_EXPERIENCE',
                                'type': 'item',
                                'tab': TAB.SETTINGS_PROFILE_EXPERIENCE_TAB
                            },
                            {
                                'id': 'info',
                                'title': 'Info',
                                'translate': 'NAV.SETTINGS_PROFILE_INFO',
                                'type': 'item',
                                'tab': TAB.SETTINGS_PROFILE_INFO_TAB
                            },
                            {
                                'id': 'photo_categories',
                                'title': 'Photo Categories',
                                'translate': 'NAV.SETTINGS_PROFILE_PHOTO_CATEGORIES',
                                'type': 'item',
                                'tab': TAB.SETTINGS_PROFILE_PHOTO_CATEGORIES_TAB
                            },
                            {
                                'id': 'ratings',
                                'title': 'Ratings',
                                'translate': 'NAV.SETTINGS_PROFILE_RATINGS',
                                'type': 'item',
                                'tab': TAB.SETTINGS_PROFILE_RATINGS_TAB
                            },
                            {
                                'id': 'showcases',
                                'title': 'Showcases',
                                'translate': 'NAV.SETTINGS_PROFILE_SHOWCASES',
                                'type': 'item',
                                'tab': TAB.SETTINGS_PROFILE_SHOWCASES_TAB
                            },
                            {
                                'id': 'video_categories',
                                'title': 'Video Categories',
                                'translate': 'NAV.SETTINGS_PROFILE_VIDEO_CATEGORIES',
                                'type': 'item',
                                'tab': TAB.SETTINGS_PROFILE_VIDEO_CATEGORIES_TAB
                            }
                        ]
                    },
                    {
                        'id': 'system',
                        'title': 'System',
                        'translate': 'NAV.SETTINGS_SYSTEM',
                        'type': 'item',
                        'tab': TAB.SETTINGS_SYSTEM_TAB
                    },
                    {
                        'id': 'templates',
                        'title': 'Templates',
                        'translate': 'NAV.SETTINGS_TEMPLATES',
                        'type': 'collapse',
                        'tab': TAB.SETTINGS_TEMPLATES_TAB,
                        'children': [
                            {
                                'id': 'email',
                                'title': 'Email',
                                'translate': 'NAV.SETTINGS_TEMPLATES_EMAIL',
                                'type': 'item',
                                'tab': TAB.SETTINGS_TEMPLATES_EMAIL_TAB
                            },
                            {
                                'id': 'email_attachments',
                                'title': 'Email Attachments',
                                'translate': 'NAV.SETTINGS_TEMPLATES_EMAIL_ATTACHMENTS',
                                'type': 'item',
                                'tab': TAB.SETTINGS_TEMPLATES_EMAIL_ATTACHMENTS_TAB
                            },
                            {
                                'id': 'sms',
                                'title': 'SMS',
                                'translate': 'NAV.SETTINGS_TEMPLATES_SMS',
                                'type': 'item',
                                'tab': TAB.SETTINGS_TEMPLATES_SMS_TAB
                            },
                            {
                                'id': 'shift_notes',
                                'title': 'Shift Notes',
                                'translate': 'NAV.SETTINGS_TEMPLATES_SHIFT_NOTES',
                                'type': 'item',
                                'tab': TAB.SETTINGS_TEMPLATES_SHIFT_NOTES_TAB
                            }
                        ]
                    },
                    {
                        'id': 'help',
                        'title': 'Help',
                        'translate': 'NAV.SETTINGS_HELP',
                        'type': 'collapse',
                        'tab': TAB.SETTINGS_HELP_TAB,
                        'children': [
                            {
                                'id': 'quickstart_guide',
                                'title': 'QuickStart Guide',
                                'translate': 'NAV.SETTINGS_HELP_QUICKSTART_GUIDE',
                                'type': 'item',
                                'tab': TAB.SETTINGS_HELP_QUICKSTART_GUIDE_TAB
                            },
                            {
                                'id': 'video_system_setup',
                                'title': 'Video - System Setup',
                                'translate': 'NAV.SETTINGS_HELP_VIDEO_SYSTEM_SETUP',
                                'type': 'item',
                                'tab': TAB.SETTINGS_HELP_VIDEO_SYSTEM_SETUP_TAB
                            },
                            {
                                'id': 'video_scheduling',
                                'title': 'Video Scheduling',
                                'translate': 'NAV.SETTINGS_HELP_VIDEO_SCHEDULING',
                                'type': 'item',
                                'tab': TAB.SETTINGS_HELP_VIDEO_SCHEDULING_TAB
                            },
                            {
                                'id': 'updates_and_changelog',
                                'title': 'Updates & Changelog',
                                'translate': 'NAV.SETTINGS_HELP_UPDATES_CHANGELOG',
                                'type': 'item',
                                'tab': TAB.SETTINGS_HELP_UPDATES_CHANGELOG_TAB
                            }
                        ]
                    }
                ]
            }
        ];
    }
}

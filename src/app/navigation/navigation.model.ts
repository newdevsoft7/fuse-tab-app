import { FuseNavigationModelInterface } from '../core/components/navigation/navigation.model';
import {
    USERS_TAB,
    USERS_EXPORTS_TAB,
    USERS_PRESENTATIONS_TAB,
    SETTINGS_PROFILE_INFO_TAB
} from '../constants/tab';

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
                'tab'   : USERS_TAB,
                'children': [
                    {
                        'id'   : 'export',
                        'title': 'Export',
                        'translate': 'NAV.USERS_EXPORT',
                        'type' : 'item',
                        'tab' : USERS_EXPORTS_TAB
                    },
                    {
                        'id': 'presentations',
                        'title': 'Presentations',
                        'translate': 'NAV.USERS_PRESENTATIONS',
                        'type': 'item',
                        'tab': USERS_PRESENTATIONS_TAB
                        
                    },
                    {
                        'id': 'new_submission',
                        'title': 'New Submission',
                        'translate': 'NAV.USERS_NEW_SUBMISSION',
                        'type': 'item',
                        'tab': { title: 'New Submission' }

                    }
                ]
            },
            {
                'id': 'schedule',
                'title': 'Schedule',
                'translate': 'NAV.SCHEDULE',
                'type': 'collapse',
                'icon': 'schedule',
                'tab': { title: 'Schedule' },
                'children': [
                    {
                        'id': 'calendar',
                        'title': 'Calendar',
                        'translate': 'NAV.SCHEDULE_CALENDAR',
                        'type': 'item',
                        'tab'  : { title: 'Calendar' }
                        
                    },
                    {
                        'id': 'list',
                        'title': 'List',
                        'translate': 'NAV.SCHEDULE_LIST',
                        'type': 'item',
                        'tab': { title: 'List' }
                    },
                    {
                        'id': 'import_shifts',
                        'title': 'Import Shifts',
                        'translate': 'NAV.SCHEDULE_IMPORT_SHIFTS',
                        'type': 'collapse',
                        'tab': { title: 'Import Shifts' },
                        'children': [
                            {
                                'id': 'import_history',
                                'title': 'Import History',
                                'translate': 'NAV.SCHEDULE_IMPORT_SHIFTS_IMPORT_HISTORY',
                                'type': 'item',
                                'tab': { title: 'Import History' }
                            },
                            {
                                'id': 'column_mapping',
                                'title': 'Column Mapping',
                                'translate': 'NAV.SCHEDULE_IMPORT_SHIFTS_COLUMN_MAPPING',
                                'type': 'item',
                                'tab': { title: 'Column Mapping' }
                            }
                        ]
                    },
                    {
                        'id': 'export_shifts',
                        'title': 'Export Shifts',
                        'translate': 'NAV.SCHEDULE_EXPORT_SHIFTS',
                        'type': 'collapse',
                        'tab': { title: 'Export Shifts' },
                        'children': [
                            {
                                'id': 'excel_spreadsheet',
                                'title': 'Excel Spreadsheet',
                                'translate': 'NAV.SCHEDULE_EXPORT_SHIFTS_EXCEL_SPREADSHEET',
                                'type': 'item',
                                'tab': { title: 'Excel Spreadsheet' }
                            },
                            {
                                'id': 'pdf_overview',
                                'title': 'PDF Overview',
                                'translate': 'NAV.SCHEDULE_EXPORT_SHIFTS_PDF_OVERVIEW',
                                'type': 'item',
                                'tab': { title: 'PDF Overview' }
                            }
                        ]
                    },
                    {
                        'id': 'new_shift',
                        'title': 'New Shift',
                        'translate': 'NAV.SCHEDULE_NEW_SHIFT',
                        'type': 'item',
                        'tab': { title: 'New Shift' }
                    }
                ]
            },
            {
                'id': 'reports_and_uploads',
                'title': 'Reports & Uploads',
                'translate': 'NAV.REPORTS_AND_UPLOADS',
                'type': 'collapse',
                'icon': 'cloud_upload',
                'tab': { title: 'Reports & Uploads' },
                'children': [
                    {
                        'id': 'report_designer',
                        'title': 'Report Designer',
                        'translate': 'NAV.REPORTS_AND_UPLOADS_REPORT_DESIGNER',
                        'type': 'item',
                        'tab': { title: 'Report Designer' }

                    },
                    {
                        'id': 'shared_files',
                        'title': 'Shared Files',
                        'translate': 'NAV.REPORTS_AND_UPLOADS_SHARED_FILES',
                        'type': 'item',
                        'tab': { title: 'Shared Files' }

                    }
                ]
            },
            {
                'id': 'accounting',
                'title': 'Accounting',
                'translate': 'NAV.ACCOUNTING',
                'type': 'collapse',
                'icon': 'attach_money',
                'tab': { title: 'Accounting' },
                'children': [
                    {
                        'id': 'staff_invoices',
                        'title': 'Staff Invoices',
                        'translate': 'NAV.ACCOUNTING_STAFF_INVOICES',
                        'type': 'collapse',
                        'tab': { title: 'Staff Invoices' },
                        'children': [
                            {
                                'id': 'generate_staff_invoices',
                                'title': 'Generate Staff Invoices',
                                'translate': 'NAV.ACCOUNTING_STAFF_INVOICES_GENERATE_STAFF_INVOICES',
                                'type': 'item',
                                'tab': { title: 'Generate Staff Invoices' }
                            },
                            {
                                'id': 'my_invoices',
                                'title': 'My Invoices',
                                'translate': 'NAV.ACCOUNTING_STAFF_INVOICES_MY_INVOICES',
                                'type': 'collapse',
                                'tab': { title: 'My Invoices' },
                                'children': [
                                    {
                                        'id': 'new_invoice',
                                        'title': 'New Invoice',
                                        'translate': 'NAV.ACCOUNTING_STAFF_INVOICES_MY_INVOICES_NEW_INVOICE',
                                        'type': 'item',
                                        'tab': { title: 'New Invoice' }
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
                'tab': { title: 'Tracking' },
                'children': [
                    {
                        'id': 'brand',
                        'title': 'Brand',
                        'translate': 'NAV.TRACKING_BRAND',
                        'type': 'item',
                        'tab': { title: 'Brand' }
                    },
                    {
                        'id': 'campaign',
                        'title': 'Campaign',
                        'translate': 'NAV.TRACKING_CAMPAIGN',
                        'type': 'item',
                        'tab': { title: 'Campaign' }
                    },
                    {
                        'id': 'job_number',
                        'title': 'Job Number',
                        'translate': 'NAV.TRACKING_JOB_NUMBER',
                        'type': 'item',
                        'tab': { title: 'Job Number' }
                    },
                    {
                        'id': 'po_number',
                        'title': 'PO Number',
                        'translate': 'NAV.TRACKING_PO_NUMBER',
                        'type': 'item',
                        'tab': { title: 'PO Number' }
                    },
                    {
                        'id': 'test',
                        'title': 'Test',
                        'translate': 'NAV.TRACKING_TEST',
                        'type': 'item',
                        'tab': { title: 'Test' }
                    }
                ]
            },
            {
                'id': 'settings',
                'title': 'Settings',
                'translate': 'NAV.SETTINGS',
                'type': 'collapse',
                'icon': 'settings',
                'tab': { title: 'Settings' },
                'children': [
                    {
                        'id': 'profile',
                        'title': 'Profile',
                        'translate': 'NAV.SETTINGS_PROFILE',
                        'type': 'collapse',
                        'tab': { title: 'Profile' },
                        'children': [
                            {
                                'id': 'attributes',
                                'title': 'Attributes',
                                'translate': 'NAV.SETTINGS_PROFILE_ATTRIBUTES',
                                'type': 'item',
                                'tab': { title: 'Attributes' }
                            },
                            {
                                'id': 'document_categories',
                                'title': 'Document Categories',
                                'translate': 'NAV.SETTINGS_PROFILE_DOCUMENT_CATEGORIES',
                                'type': 'item',
                                'tab': { title: 'Document Categories' }
                            },
                            {
                                'id': 'experience',
                                'title': 'Experience',
                                'translate': 'NAV.SETTINGS_PROFILE_EXPERIENCE',
                                'type': 'item',
                                'tab': { title: 'Experience' }
                            },
                            {
                                'id': 'info',
                                'title': 'Info',
                                'translate': 'NAV.SETTINGS_PROFILE_INFO',
                                'type': 'item',
                                'tab': SETTINGS_PROFILE_INFO_TAB
                            },
                            {
                                'id': 'photo_categories',
                                'title': 'Photo Categories',
                                'translate': 'NAV.SETTINGS_PROFILE_PHOTO_CATEGORIES',
                                'type': 'item',
                                'tab': { title: 'Photo Categories' }
                            },
                            {
                                'id': 'ratings',
                                'title': 'Ratings',
                                'translate': 'NAV.SETTINGS_PROFILE_RATINGS',
                                'type': 'item',
                                'tab': { title: 'Ratings' }
                            },
                            {
                                'id': 'showcases',
                                'title': 'Showcases',
                                'translate': 'NAV.SETTINGS_PROFILE_SHOWCASES',
                                'type': 'item',
                                'tab': { title: 'Showcases' }
                            },
                            {
                                'id': 'video_categories',
                                'title': 'Video Categories',
                                'translate': 'NAV.SETTINGS_PROFILE_VIDEO_CATEGORIES',
                                'type': 'item',
                                'tab': { title: 'Video Categories' }
                            }
                        ]
                    },
                    {
                        'id': 'system',
                        'title': 'System',
                        'translate': 'NAV.SETTINGS_SYSTEM',
                        'type': 'item',
                        'tab': { title: 'System' }
                    },
                    {
                        'id': 'templates',
                        'title': 'Templates',
                        'translate': 'NAV.SETTINGS_TEMPLATES',
                        'type': 'collapse',
                        'tab': { title: 'Templates' },
                        'children': [
                            {
                                'id': 'email',
                                'title': 'Email',
                                'translate': 'NAV.SETTINGS_TEMPLATES_EMAIL',
                                'type': 'item',
                                'tab': { title: 'Email' }
                            },
                            {
                                'id': 'email_attachments',
                                'title': 'Email Attachments',
                                'translate': 'NAV.SETTINGS_TEMPLATES_EMAIL_ATTACHMENTS',
                                'type': 'item',
                                'tab': { title: 'Email Attachments' }
                            },
                            {
                                'id': 'sms',
                                'title': 'SMS',
                                'translate': 'NAV.SETTINGS_TEMPLATES_SMS',
                                'type': 'item',
                                'tab': { title: 'SMS' }
                            },
                            {
                                'id': 'shift_notes',
                                'title': 'Shift Notes',
                                'translate': 'NAV.SETTINGS_TEMPLATES_SHIFT_NOTES',
                                'type': 'item',
                                'tab': { title: 'Shift Notes' }
                            }
                        ]
                    },
                    {
                        'id': 'help',
                        'title': 'Help',
                        'translate': 'NAV.SETTINGS_HELP',
                        'type': 'collapse',
                        'tab': { title: 'Help' },
                        'children': [
                            {
                                'id': 'quickstart_guide',
                                'title': 'QuickStart Guide',
                                'translate': 'NAV.SETTINGS_HELP_QUICKSTART_GUIDE',
                                'type': 'item',
                                'tab': { title: 'QuickStart Guide' }
                            },
                            {
                                'id': 'video_system_setup',
                                'title': 'Video - System Setup',
                                'translate': 'NAV.SETTINGS_HELP_VIDEO_SYSTEM_SETUP',
                                'type': 'item',
                                'tab': { title: 'Video - System Setup' }
                            },
                            {
                                'id': 'video_scheduling',
                                'title': 'Video Scheduling',
                                'translate': 'NAV.SETTINGS_HELP_VIDEO_SCHEDULING',
                                'type': 'item',
                                'tab': { title: 'Video Scheduling' }
                            },
                            {
                                'id': 'updates_and_changelog',
                                'title': 'Updates & Changelog',
                                'translate': 'NAV.SETTINGS_HELP_UPDATES_CHANGELOG',
                                'type': 'item',
                                'tab': { title: 'Updates & Changelog' }
                            }
                        ]
                    }
                ]
            }
        ];
    }
}

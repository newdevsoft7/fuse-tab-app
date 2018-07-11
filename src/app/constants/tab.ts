import { Tab } from '../main/tab/tab';

export const TAB = {
   // Admin tabs
    'USERS_TAB': new Tab('Users', 'usersTpl', 'users', {}),
    'USERS_PROFILE_TAB': new Tab('Profile', 'profileTpl', 'users/profile', {}),
    'USERS_NEW_SUBMISSION_TAB': new Tab('New Submission', '', 'users/new-submission', {}),
    'USERS_NEW_USER_TAB': new Tab('New User', '', 'users/new-user', {}),
    'USERS_RECENT_ACTIVITY_TAB': new Tab('Recent Activity', '', 'users/recent-activity', {}),
    'USERS_NEW_MESSAGE_TAB': new Tab('New Message', 'newMessageTpl', 'users/new-message', {}, true),
    'USERS_CARDS': new Tab('Cards', 'cardsTpl', 'users/cards', {}, true),
    'USERS_PRESENTATIONS_TAB': new Tab('Presentations', 'presentationsTpl', 'users/presentations', {}, true),
    'USERS_CHAT_TAB': new Tab('Chat', 'usersChatTpl', 'users/chat', {}),

    'CLIENTS_TAB': new Tab('Clients', 'clientsTpl', 'clients', {}),

    'CLIENT_INVOICES_TAB': new Tab('Client Invoices', 'clientInvoicesTpl', 'client-invoices', {}),
    'CLIENT_INVOICE_GENERATE_TAB': new Tab('Generate Client Invoice', 'clientInvoiceGenerateTpl', 'client-invoice/generate', {}),

    'OUTSOURCE_COMPANIES_TAB': new Tab('Outsource Companies', 'outsourceCompaniesTpl', 'outsource-companies', {}),

    'SCHEDULE_CALENDAR_TAB': new Tab('Calendar', 'scheduleCalendarTpl', 'schedule/calendar', {}),
    'SCHEDULE_ADMIN_LIST_TAB': new Tab('List', 'adminShiftListTpl', 'schedule/admin-list', {}),
    'SCHEDULE_ADMIN_SHIFT_TAB': new Tab('Shift', 'scheduleAdminShiftTpl', 'schedule/shift', {}),
    'SCHEDULE_IMPORT_SHIFTS_TAB': new Tab('Import Shifts', 'shiftsImportTpl', 'schedule/import-shifts', {}),
    'SCHEDULE_IMPORT_SHIFTS_IMPORT_HISTORY_TAB': new Tab('Import History', 'importHistoryTpl', 'schedule/import-shifts/import-history', {}),
    'SCHEDULE_IMPORT_SHIFTS_COLUMN_MAPPING_TAB': new Tab('Column Mapping', 'columnMappingTpl', 'schedule/import-shifts/column-mapping', {}),
    'SCHEDULE_EXPORT_SHIFTS_TAB': new Tab('Export Shifts', '', 'schedule/export-shift', {}),
    'SCHEDULE_NEW_SHIFT_TAB': new Tab('New Shift', 'newShiftTpl', 'schedule/new-shift', { url: 'schedule/new-shift'}),
    'SCHEDULE_EXPORT_SHIFTS_PDF_OVERVIEW_TAB': new Tab('Export Shifts as PDF', 'shiftsExportAsPdfTpl', 'schedule/export-shift/pdf-overview', {}),

    'REPORTS_AND_UPLOADS_TAB': new Tab('Reports & Uploads', 'reportsUploadsTpl', 'reports-and-uploads', {}),
    'REPORTS_AND_UPLOADS_REPORT_DESIGNER_TAB': new Tab('Report Designer', '', 'reports-and-uploads/report-designer', {}),
    'REPORTS_AND_UPLOADS_SHARED_FILES_TAB': new Tab('Shared Files', '', 'reports-and-uploads/shared-file', {}),
    'QUIZS_TAB': new Tab('Quizs', 'quizsTpl', 'quizs', {}),
    'SURVEYS_TAB': new Tab('Surveys', 'surveysTpl', 'surveys', {}),

    'ACCOUNTING_TAB': new Tab('Accounting', '', 'accounting', {}),
    'ACCOUNTING_STAFF_INVOICES_TAB': new Tab('Staff Invoices', 'adminStaffInvoiceListTpl', 'accounting/staff-invoices', {}),
    'ACCOUNTING_STAFF_INVOICES_GENERATE_STAFF_INVOICES_TAB':
        new Tab('Generate Staff Invoices', 'adminGenStaffInvoicesTpl', 'accounting/admin/staff-invoices/generate', {}),
    'ACCOUNTING_STAFF_INVOICES_MY_INVOICES_TAB': new Tab('My Invoices', '', 'accounting/staff-invoices/my-invoices', {}),
    'ACCOUNTING_STAFF_INVOICES_MY_INVOICES_NEW_INVOICE_TAB': new Tab('New Invoice', '', 'accounting/staff-invoices/my-invoices/new', {}),

    'TRACKING_TAB': new Tab('Tracking', 'trackingTpl', 'tracking', {}),

    'SETTINGS_TAB': new Tab('Settings', 'settingsTpl', 'settings', {}),
    'SETTINGS_SYSTEM_TAB': new Tab('System', '', 'settings/system', {}),
    'SETTINGS_TEMPLATES_TAB': new Tab('Templates', '', 'settings/templates', {}),
    'SETTINGS_TEMPLATES_EMAIL_TAB': new Tab('Email Templates', 'emailTemplatesTpl', 'settings/templates/email', {}),
    'SETTINGS_TEMPLATES_EMAIL_ATTACHMENTS_TAB': new Tab('Email Attachments', '', 'settings/templates/email/attachments', {}),
    'SETTINGS_TEMPLATES_SMS_TAB': new Tab('SMS', '', 'settings/templates/sms', {}),
    'SETTINGS_TEMPLATES_SHIFT_NOTES_TAB': new Tab('Shift Notes', '', 'settings/templates/shift-notes',  {}),
    'SETTINGS_HELP_TAB': new Tab('Help', '', 'settings/help', {}),
    'SETTINGS_HELP_QUICKSTART_GUIDE_TAB': new Tab('QuickStart Guide', '', 'settings/help/quickstart-guide', {}),
    'SETTINGS_HELP_VIDEO_SYSTEM_SETUP_TAB': new Tab('Video - System Setup', '', 'settings/help/video-system-setup', {}),
    'SETTINGS_HELP_VIDEO_SCHEDULING_TAB': new Tab('Video Scheduling', '', 'settings/help/video-scheduling', {}),
    'SETTINGS_HELP_UPDATES_CHANGELOG_TAB': new Tab('Updates & Changelog', '', 'settings/help/updates-changelog', {}),

    // Staff tabs
    'STAFF_INVOICES_TAB': new Tab('Pay', 'payrollTpl', 'staff/invoices', {}),
    'STAFF_NEW_INVOICE_TAB': new Tab('New Invoice', 'generatePayrollTpl', 'staff/new-invoice', {}),

    // Client tabs
    'SCHEDULE_CLIENT_LIST_TAB': new Tab('List', 'clientShiftListTpl', 'schedule/client-list', {}),
    'CLIENT_NEW_BOOKING_TAB': new Tab('New Booking', 'clientNewBookingTpl', 'schedule/client-new-booking', {})
};

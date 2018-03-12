import { Tab } from "../main/tab/tab";

// Admin tabs
export const USERS_TAB = new Tab('Users', 'usersTpl', 'users', {});
export const USERS_PRESENTATIONS_TAB = new Tab('Presentations', '', 'users/presentations', {});
export const USERS_PROFILE_TAB = new Tab('Profile', 'profileTpl', 'users/profile', {});
export const USERS_NEW_SUBMISSION_TAB = new Tab('New Submission', '', 'users/new-submission', {});
export const USERS_NEW_USER_TAB = new Tab('New User', '', 'users/new-user', {});
export const USERS_RECENT_ACTIVITY_TAB = new Tab('Recent Activity', '', 'users/recent-activity', {});
export const USERS_NEW_MESSAGE_TAB = new Tab('New Message', '', 'users/new-message', {});
export const USERS_CHAT_TAB = new Tab('Chat', 'usersChatTpl', 'users/chat', {});

export const SCHEDULE_CALENDAR_TAB = new Tab('Calendar', 'scheduleCalendarTpl', 'schedule/calendar', {});
export const SCHEDULE_ADMIN_LIST_TAB = new Tab('List', 'adminShiftListTpl', 'schedule/admin-list', {});
export const SCHEDULE_ADMIN_SHIFT_TAB = new Tab('Shift','scheduleAdminShiftTpl', 'schedule/shift', {});
export const SCHEDULE_IMPORT_SHIFTS_TAB = new Tab('Import Shifts', 'shiftsImportTpl', 'schedule/import-shifts', {});
export const SCHEDULE_IMPORT_SHIFTS_IMPORT_HISTORY_TAB = new Tab('Import History', '', 'schedule/import-shifts/import-history', {});
export const SCHEDULE_IMPORT_SHIFTS_COLUMN_MAPPING_TAB = new Tab('Column Mapping', '', 'schedule/import-shifts/column-mapping', {});
export const SCHEDULE_EXPORT_SHIFTS_TAB = new Tab('Export Shifts', '', 'schedule/export-shift', {});
export const SCHEDULE_NEW_SHIFT_TAB = new Tab('New Shift', 'newShiftTpl', 'schedule/new-shift', { url: 'schedule/new-shift'});
export const SCHEDULE_EXPORT_SHIFTS_EXCEL_SPREADSHEET_TAB = new Tab('Export Shifts as Excel', 'shiftsExportAsExcelTpl', 'schedule/export-shift/excel-spreadsheet', {});
export const SCHEDULE_EXPORT_SHIFTS_PDF_OVERVIEW_TAB = new Tab('Export Shifts as PDF', 'shiftsExportAsPdfTpl', 'schedule/export-shift/pdf-overview', {});

export const REPORTS_AND_UPLOADS_TAB = new Tab('Reports & Uploads', '', 'reports-and-uploads', {});
export const REPORTS_AND_UPLOADS_REPORT_DESIGNER_TAB = new Tab('Report Designer', '', 'reports-and-uploads/report-designer', {});
export const REPORTS_AND_UPLOADS_SHARED_FILES_TAB = new Tab('Shared Files', '', 'reports-and-uploads/shared-file', {});

export const ACCOUNTING_TAB = new Tab('Accounting', '', 'accounting', {});
export const ACCOUNTING_STAFF_INVOICES_TAB = new Tab('Staff Invoices', 'adminStaffInvoiceListTpl', 'accounting/staff-invoices', {});
export const ACCOUNTING_STAFF_INVOICES_GENERATE_STAFF_INVOICES_TAB = new Tab('Generate Staff Invoices', 'adminGenStaffInvoicesTpl', 'accounting/admin/staff-invoices/generate', {});
export const ACCOUNTING_STAFF_INVOICES_MY_INVOICES_TAB = new Tab('My Invoices', '', 'accounting/staff-invoices/my-invoices', {});
export const ACCOUNTING_STAFF_INVOICES_MY_INVOICES_NEW_INVOICE_TAB = new Tab('New Invoice', '', 'accounting/staff-invoices/my-invoices/new', {});

export const TRACKING_TAB = new Tab('Tracking', 'trackingTpl', 'tracking', {});

export const SETTINGS_TAB = new Tab('Settings', 'settingsTpl', 'settings', {});
export const SETTINGS_PROFILE_TAB = new Tab('Profile', '', 'settings/profile', {});
export const SETTINGS_PROFILE_ATTRIBUTES_TAB = new Tab('Attributes', 'settingsProfileAttributesTpl', 'settings/profile/attributes', {});
export const SETTINGS_PROFILE_DOCUMENT_CATEGORIES_TAB = new Tab('Document Categories', '', 'settings/profile/document-categories', {});
export const SETTINGS_PROFILE_EXPERIENCE_TAB = new Tab('Experience', '', 'settings/profile/experience', {});
export const SETTINGS_PROFILE_INFO_TAB = new Tab('Profile Info', 'settingsProfileInfoTpl', 'settings/profile/info', {});
export const SETTINGS_PROFILE_PHOTO_CATEGORIES_TAB = new Tab('Photo Categories', '', 'settings/profile/photo-categories', {});
export const SETTINGS_PROFILE_RATINGS_TAB = new Tab('Ratings', 'settingsProfileRatingsTpl', 'settings/profile/rating', {});
export const SETTINGS_PROFILE_SHOWCASES_TAB = new Tab('Showcases', '', 'settings/profile/showcases', {});
export const SETTINGS_PROFILE_VIDEO_CATEGORIES_TAB = new Tab('Video Categories', '', 'settings/profile/video-categories', {});
export const SETTINGS_SYSTEM_TAB = new Tab('System', '', 'settings/system', {});
export const SETTINGS_TEMPLATES_TAB = new Tab('Templates', '', 'settings/templates', {});
export const SETTINGS_TEMPLATES_EMAIL_TAB = new Tab('Email', '', 'settings/templates/email', {});
export const SETTINGS_TEMPLATES_EMAIL_ATTACHMENTS_TAB = new Tab('Email Attachments', '', 'settings/templates/email/attachments', {});
export const SETTINGS_TEMPLATES_SMS_TAB = new Tab('SMS', '', 'settings/templates/sms', {});
export const SETTINGS_TEMPLATES_SHIFT_NOTES_TAB = new Tab('Shift Notes', '', 'settings/templates/shift-notes',  {});
export const SETTINGS_HELP_TAB = new Tab('Help', '', 'settings/help', {});
export const SETTINGS_HELP_QUICKSTART_GUIDE_TAB = new Tab('QuickStart Guide', '', 'settings/help/quickstart-guide', {});
export const SETTINGS_HELP_VIDEO_SYSTEM_SETUP_TAB = new Tab('Video - System Setup', '', 'settings/help/video-system-setup', {});
export const SETTINGS_HELP_VIDEO_SCHEDULING_TAB = new Tab('Video Scheduling', '', 'settings/help/video-scheduling', {});
export const SETTINGS_HELP_UPDATES_CHANGELOG_TAB = new Tab('Updates & Changelog', '', 'settings/help/updates-changelog', {});


// Staff tabs
export const STAFF_INVOICES_TAB = new Tab('Invoices', '', 'staff/invoices', {});
export const STAFF_NEW_INVOICE_TAB = new Tab('New Invoice', '', 'staff/new-invoce', {});

// Client tabs
export const SCHEDULE_CLIENT_LIST_TAB = new Tab('List', 'clientShiftListTpl', 'schedule/client-list', {});
export const CLIENT_NEW_BOOKING_TAB = new Tab('New Booking', 'clientNewBookingTpl', 'schedule/client-new-booking', {})
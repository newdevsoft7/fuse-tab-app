import { FuseNavigationModelInterface } from '../core/components/navigation/navigation.model';

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
                'icon'  : 'dashboard',
                'children': [
                    {
                        'id'   : 'export',
                        'title': 'Export',
                        'translate': 'NAV.USERS_EXPORT',
                        'type' : 'item',
                        'icon' : 'email',
                        'url'  : '/sample'
                    },
                    {
                        'id': 'presentations',
                        'title': 'Presentations',
                        'translate': 'NAV.USERS_PRESENTATIONS',
                        'type': 'item',
                        'icon': 'email',
                        'url': '/presentations'
                        
                    }
                ]
            },
            {
                'id': 'schedule',
                'title': 'Schedule',
                'translate': 'NAV.SCHEDULE',
                'type': 'collapse',
                'icon': 'dashboard',
                'children': [
                    {
                        'id': 'calendar',
                        'title': 'Calendar',
                        'translate': 'NAV.SCHEDULE_CALENDAR',
                        'type': 'item',
                        'icon': 'email',
                        'url'  : '/schedule'
                        
                    },
                    {
                        'id': 'list',
                        'title': 'List',
                        'translate': 'NAV.SCHEDULE_LIST',
                        'type': 'item',
                        'icon': 'email',
                        'url': '/schedule/list'
                    },
                    {
                        'id': 'import_shifts',
                        'title': 'Import Shifts',
                        'translate': 'NAV.SCHEDULE_IMPORT_SHIFTS',
                        'type': 'collapse',
                        'icon': 'email',
                        'children': [
                            {
                                'id': 'import_history',
                                'title': 'Import History',
                                'translate': 'NAV.SCHEDULE_IMPORT_SHIFTS_IMPORT_HISTORY',
                                'type': 'item',
                                'icon': 'email',
                                'url': '/schedule/import_shifts/import_history'
                            },
                            {
                                'id': 'column_mapping',
                                'title': 'Column Mapping',
                                'translate': 'NAV.SCHEDULE_IMPORT_SHIFTS_COLUMN_MAPPING',
                                'type': 'item',
                                'icon': 'email',
                                'url': '/schedule/import_shifts/column_mapping'
                            }
                        ]
                    }
                ]
            }
        ];
    }
}

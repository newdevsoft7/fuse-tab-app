export const TRACKING_CATEGORY_STAFF_VISIBILITY: any[] = [
    { value: 'hidden', label: 'Hidden' },
    { value: 'visible', label: 'Visible' },
    { value: 'visible_after_selection', label: 'Visible After Selection' },
];

export const TRACKING_CATEGORY_CLIENT_VISIBILITY: any[] = [
    { value: 'hidden', label: 'Hidden' },
    { value: 'visible', label: 'Visible' },
];

export const TRACKING_OPTION_STAFF_VISIBILITY: any[] = [
    { value: 'all', label: 'All' },
    { value: 'team', label: 'Team' },
];

export class TrackingOption {
    id: string;
    oname: string;
    staff_visibility: string;
    active: number;
    tracking_cat_id:string;

    constructor(trackingOption) {
        {
            this.id = trackingOption.id || 0;
            this.oname = trackingOption.oname || '';
            this.staff_visibility = trackingOption.staff_visibility || TRACKING_OPTION_STAFF_VISIBILITY[0].value;
            this.active = trackingOption.active || 0;
            this.tracking_cat_id = trackingOption.tracking_cat_id || null;
        }
    }
}

export class TrackingCategory {
    id: string;
    cname: string;
    staff_visibility: string;
    client_visibility: string;
    required: string;

    constructor(trackingCategory) {
        {
            this.id = trackingCategory.id || 0;
            this.cname = trackingCategory.cname || '';
            this.staff_visibility = trackingCategory.staff_visibility || TRACKING_CATEGORY_STAFF_VISIBILITY[0].value;
            this.client_visibility = trackingCategory.client_visibility || TRACKING_CATEGORY_CLIENT_VISIBILITY[0].value;
            this.required = trackingCategory.required || '0';
        }
    }
}

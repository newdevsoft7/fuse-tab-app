export const PROFILE_ATTRIBUTE_ROLE = [
    { value: '', label: 'Any' },
    { value: 'yes', label: 'Yes' },
    { value: 'no', label: 'No' },
];

export const PROFILE_ATTRIBUTE_VISIBILITY = [
    { value: 'staff', label: 'Staff' },
    { value: 'admin', label: 'Admin' },    
];

export class ProfileAttribute {
    id: string;
    aname: string;
    visibility: string;
    role_default: string;
    display_order: string;
    attribute_cat_id: string;

    constructor(profileAttribute) {
        {
            this.id = profileAttribute.id || 0;
            this.aname = profileAttribute.aname || '';
            this.visibility = profileAttribute.visibility || PROFILE_ATTRIBUTE_VISIBILITY[0].value;
            this.role_default = profileAttribute.role_default || '';            
            this.display_order = profileAttribute.display_order || '';
            this.attribute_cat_id = profileAttribute.attribute_cat_id || null;
        }
    }
}

export class ProfileAttributeCategory {
    id: string;
    cname: string;
    display_order: string;

    constructor(profileAttributeCategory) {
        {
            this.id = profileAttributeCategory.id || 0;
            this.cname = profileAttributeCategory.cname || '';
            this.display_order = profileAttributeCategory.display_order || '';            
        }
    }
}
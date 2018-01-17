export class ProfileField {
    id: string;
    cname: string;
    ename: string;
    etype: string;
    editable: string;
    deletable: string;
    visibility: string;
    display_order: string;
    sex: string;
    filter: string;
    profile_cat_id: string;
    options: any[];

    constructor(profileField) {
        {
            this.id = profileField.id || 0;
            this.cname = profileField.cname;
            this.ename = profileField.ename || '';
            this.etype = profileField.etype || '';
            this.editable = profileField.editable || '1';
            this.deletable = profileField.deletable || '1';
            this.visibility = profileField.visibility || '';
            this.display_order = profileField.display_order || '';
            this.sex = profileField.sex || 'Both';
            this.filter = profileField.filter || 'range';
            this.profile_cat_id = profileField.profile_cat_id || 1;
            this.options = profileField.options || [];
        }
    }
}

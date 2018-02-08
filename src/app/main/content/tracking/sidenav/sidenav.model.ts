export class TrackingSideNavModel {
    public title: string;
    public template: string;
    public url: string;
    public data = {};
    public shouldAlwaysOpen: boolean = false


    constructor(trackingSideNav) {
        this.title = trackingSideNav.title || 0;
        this.template = trackingSideNav.template || '';
        this.url = trackingSideNav.url || '';
        this.data = trackingSideNav.data || {};
        this.shouldAlwaysOpen = trackingSideNav.shouldAlwaysOpen || false;
    }
}
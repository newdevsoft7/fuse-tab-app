export class Tab {
    constructor(
        public title: string,
        public template: string,
        public url: string,
        public data = {},
        public multiple: boolean = false,
        public shouldAlwaysOpen: boolean = false
    ) {}
}

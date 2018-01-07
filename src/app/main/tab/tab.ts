export class Tab {
    constructor(
        public title: string,
        public template: string,
        public data = {},
        public shouldAlwaysOpen: boolean = false
    ) {}
}

export class ContentNode {

    constructor(
        public readonly name: string,
        public readonly isAttribute: boolean)
    {}

    public get composable(): boolean {
        return false;
    }
}
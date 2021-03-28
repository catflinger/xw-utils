import { ContentNode } from './content-node';

export class Text extends ContentNode {

    //private readonly children: readonly ContentNode[];

    constructor(
        private value: string,
        //...children: ContentNode[]
    ) {
            super("span", false);
            //this.children = children ?? [];
    }

    public toString(): string {
        return this.value || "";
    }
}
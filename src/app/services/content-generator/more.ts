import { ContentNode } from './content-node';

export class More extends ContentNode {

    constructor() {
            super(null, false);
    }

    public toString(indent: boolean = false): string {
        const newline = indent ? "\n" : "";

        return `<!--more-->${newline}`;
    }
}
import { ContentNode } from './content-node';

export class Comment extends ContentNode {

    constructor(
        private value: string,
    ) {
            super(null, false);
    }

    public toString(indent: boolean = false): string {
        const newline = indent ? "\n" : "";

        return `<!-- ${this.value} -->${newline}`;
    }
}
import { ContentNode } from './content-node';

export class Comment extends ContentNode {

    constructor(
        private value: string,
    ) {
            super(null, false);
    }

    public toString(): string {
        return `<!--- ${this.value} -->\n`;
    }
}
import { ContentNode } from './content-node';

export class Attribute extends ContentNode {

    constructor(
        name: string,
        private value: string,
    ) {
            super(name, true);
    }

    public toString(): string {
        return ` ${this.name}="${this.value}"`;
    }
}
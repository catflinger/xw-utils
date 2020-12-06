import { ContentNode } from './content-node';

export class StyleAttribute extends ContentNode {

    constructor(
        public  readonly value: string,
    ) {
            super("style", true);
    }
    
    public get composable(): boolean {
        return true;
    }
    
    public toString(): string {
        return ` ${this.name}="${this.value}"`;
    }
}
import { ContentNode } from './content-node';

export class ClassAttribute extends ContentNode {

    constructor(
        public  readonly value: string,
    ) {
            super("class", true);
    }
    
    public get composable(): boolean {
        return true;
    }
    
    public toString(): string {
        return ` ${this.name}="${this.value}"`;
    }
}
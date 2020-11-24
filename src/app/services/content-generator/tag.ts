import { ContentNode } from './content-node';

export class Tag extends ContentNode {

    private readonly children: readonly ContentNode[];

    constructor(
        name: string,
        ...children: ContentNode[]
    ) {
            super(name, false);
            this.children = children ?? [];
    }

    public toString(): string {
        let buffer = `<${this.name}`;

        this.children
        .filter(ch => ch.isAttribute)
        .forEach(attr => {
            buffer += attr.toString();
        });

        buffer += `>\n`;

        this.children
        .filter(ch => !ch.isAttribute)
        .forEach(tag => {
            buffer += tag.toString();
        });
        
        buffer += `\n</${this.name}>\n`;
        return buffer;
    }
}
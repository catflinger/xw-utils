import { ContentNode } from './content-node';

export class Root extends ContentNode {

    private readonly children: readonly ContentNode[];

    constructor(
        ...children: ContentNode[]
    ) {
            super("", false);
            this.children = children ? children.filter(ch => !!ch) : [];
    }

    public toString(indent: boolean = false): string {
        const newline = indent ? "\n" : "";
        let buffer = ``;

        // the root "tag" acts as a container only
        // it ignores attributes and displays child tags only

        this.children
        .filter(ch => ch && !ch.isAttribute)
        .forEach(tag => {
            buffer += tag.toString();
        });

        buffer += `${newline}`;
        return buffer;
    }
}
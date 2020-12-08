import { from, GroupedObservable } from 'rxjs';
import { concatMap, filter, groupBy, map, mergeMap, reduce, tap, toArray } from 'rxjs/operators';
import { Attribute } from './attribute';
import { ContentNode } from './content-node';


export class Tag extends ContentNode {

    private readonly children: readonly ContentNode[];

    constructor(
        name: string,
        ...children: ContentNode[]
    ) {
            super(name, false);
            this.children = children ? children.filter(ch => !!ch) : [];
    }

    public toString(indent: boolean = false): string {
        const newline = indent ? "\n" : "";
        let buffer = `<${this.name}`;

        // TO DO: Learn more about rxjs and improve this

        // consolidate so that we do dot get multiple attributes with the same name on a tag
        from(this.children)
        .pipe(
            filter((ch: ContentNode) => ch && ch.isAttribute),
            groupBy(attr => attr.name),
        ).subscribe(group => {
            group.pipe(
                reduce((result, attr: Attribute) => result += ` ${attr.value}`, "")
            ).subscribe(z => buffer += ` ${group.key}="${z}"`)
        });

        buffer += `>${newline}`;

        this.children
        .filter(ch => ch && !ch.isAttribute)
        .forEach(tag => {
            buffer += tag.toString();
        });

        buffer += `${newline}</${this.name}>${newline}`;
        return buffer;
    }

    private writeComposedAttribute(name: string, values: string[]) {

    }
}
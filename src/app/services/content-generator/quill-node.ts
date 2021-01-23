import { QuillDeltaToHtmlConverter } from 'quill-delta-to-html';
import { QuillDelta } from 'src/app/model/puzzle-model/quill-delta';
import { ContentNode } from './content-node';

export class QuillNode extends ContentNode {

    constructor(
        private delta: QuillDelta,
    ) {
            super(null, false);
    }

    public toString(): string {
        let markup = "";

        if (this.delta && this.delta.ops && this.delta.ops.length) {
            const converter = new QuillDeltaToHtmlConverter(
                this.delta.ops,
                { inlineStyles: true,
                multiLineParagraph: false,
             });

            markup = converter.convert();
        }

        return markup;
    }
}
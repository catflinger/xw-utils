import { LineType, TextParsingOptions } from './types';

export class Line {

    constructor(
        public readonly rawText: string,
        public readonly lineNumber: number,
        public readonly options: TextParsingOptions,
    ) {}

    public get lineType(): LineType {
        let result: LineType = "unknown";

        if (this.isEmpty) {
            result = "empty";
        } else if (this.hasAcrossMarker) {
            result = "acrossMarker";
        } else if (this.hasDownMarker) {
            result = "downMarker";
        } else if (this.hasStartMarker && this.hasEndMarker) {
            result = "clue";
        } else if (this.hasStartMarker) {
            result = "partialClueStart";
        } else if (this.hasEndMarker) {
            result = "partialClueEnd";
        }

        return result;
    }

    public get text(): string {
        return this.rawText.trim();
    }

    protected get isEmpty(): boolean {
        return this.rawText.trim().length === 0;
    }

    protected get hasStartMarker(): boolean {
        if (this.options && this.options.azedFeatures) {
            return /^\*?\s*\d{1,2}\D/i.test(this.text);
        } else {
            return /^\d{1,2}\D/i.test(this.text);
        }
    }

    protected get hasEndMarker(): boolean {
        return /\(\d[,0-9- ]*( words)?\s?\)$/i.test(this.text);
    }

    protected get hasAcrossMarker(): boolean {
        if (this.options.allowTypos) {
            return /^(ACROSS)|(ACROS)|(AROSS)$/i.test(this.text);

        } else {
            return /^ACROSS$/i.test(this.text);
        }
    }

    protected get hasDownMarker(): boolean {
        return /^DOWN$/i.test(this.text);
    }

}
import { LineType, TextParsingOptions } from './types';

export class Line {

    constructor(
        public readonly rawText: string,
        public readonly lineNumber: number,
        public readonly options?: TextParsingOptions,
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
        } else if (this.hasEndMarker || this.hasPartialEndMarker) {
            result = "partialClueEnd";
        }

        return result;
    }

    public get text(): string {
        return this.rawText.trim();
    }

    private get isEmpty(): boolean {
        return this.rawText.trim().length === 0;
    }

    private get hasStartMarker(): boolean {
        if (this.options && this.options && this.options.azedFeatures) {
            return /^\*?\s*\d{1,2}\D/i.test(this.text);
        } else {
            return /^\d{1,2}\D/i.test(this.text);
        }
    }

    private get hasEndMarker(): boolean {
        return /\(\d[,0-9- ]*(words|apostrophe)?\s?\)$/i.test(this.text);
    }

    private get hasPartialEndMarker(): boolean {
        return !this.text.includes("(") && /[,0-9- ]*(words|apostrophe)?\s?\)$/i.test(this.text);
    }

    private get hasAcrossMarker(): boolean {
        if (this.options && this.options.allowTypos) {
            return /^(ACROSS|ACROS|AROSS|ACRPSS)$/i.test(this.text);
        } else {
            return /^ACROSS$/i.test(this.text);
        }
    }

    private get hasDownMarker(): boolean {
        return /^DOWN$/i.test(this.text);
    }

}
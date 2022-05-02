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
        } else if (this.hasEndMarker || this.hasPartialEndMarker) {
            result = "partialClueEnd";
        } else if (this.hasStartMarker) {
            result = "partialClueStart";
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
        if (this.options.captionStyle === "any") {
            return true;
        
        } else if (this.options.captionStyle === "alphabetical") {
            let exp = new RegExp(String.raw`^\s*[A-Z]\s`);
            return exp.test(this.text);
        
        } else if (this.options && this.options.azedFeatures) {
            let exp = new RegExp(String.raw`^\*?\s*\d{1,2}\D`, "i");
            return exp.test(this.text);

        } else {
            let exp = new RegExp(String.raw`^\d{1,2}\D`, "i");
            return exp.test(this.text);
        }
    }

    private get hasEndMarker(): boolean {
        if (!this.options.hasLetterCount) {
            return true;
        } else {
            let exp: RegExp = new RegExp(String.raw`\(\d[,0-9- ]*(words)?(\s*,\s*apostrophe)?\s*\)$`, "i");
            return exp.test(this.text);
        }
    }

    private get hasPartialEndMarker(): boolean {
        if (!this.options.hasLetterCount) {
            return false;
        } else {
            let exp = new RegExp(String.raw`^\s*[,0-9- ]*(words)?(\s*,\s*apostrophe)?\s*\)$`, "i");
            return exp.test(this.text);
        }
        
    }

    private get hasAcrossMarker(): boolean {
        if (this.options && this.options.allowTypos) {
            let exp = new RegExp(String.raw`^(ACROSS|ACROS|AROSS|ACRPSS)$`, "i");
            return exp.test(this.text);
        } else {
            let exp = new RegExp(String.raw`^ACROSS$`, "i");
            return exp.test(this.text);
        }
    }

    private get hasDownMarker(): boolean {
        let exp = new RegExp(String.raw`^DOWN$`, "i");
        return exp.test(this.text);
    }

}
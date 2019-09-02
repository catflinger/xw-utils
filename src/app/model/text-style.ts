export interface ITextStyle {
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
}

export class TextStyle implements ITextStyle {
        public readonly color: string;
        public readonly bold: boolean;
        public readonly italic: boolean;
        public readonly underline: boolean;

        constructor(data) {
            this.color = data.color;
            this.bold = data.bold;
            this.italic = data.italic;
            this.underline = data.underline;
        }

}
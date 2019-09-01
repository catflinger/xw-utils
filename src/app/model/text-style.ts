export interface ITextStyle {
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
}

export class TextStyle implements ITextStyle {
    constructor(
        public readonly color: string,
        public readonly bold: boolean,
        public readonly italic: boolean,
        public readonly underline: boolean) { }

}
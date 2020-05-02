import { ITextStyle, TextStyleName } from '../interfaces';

export class TextStyle implements ITextStyle {
        public readonly name: TextStyleName;
        public readonly color: string;
        public readonly bold: boolean;
        public readonly italic: boolean;
        public readonly underline: boolean;

        constructor(data) {
            this.name = data.name;
            this.color = data.color || "black";
            this.bold = data.bold || false;
            this.italic = data.italic || false;
            this.underline = data.underline || false;
        }

        public toCssStyleString(): string {
            let result = `color: ${this.color};`;

            if (this.bold) {
                result = result.concat(" font-weight: bold;")
            }
            
            if (this.italic) {
                result = result.concat(" font-style: italic;")
            }
            
            if (this.underline) {
                result = result.concat(" text-decoration: underline;")
            }
            
            return result;
        }
}

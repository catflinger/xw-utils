import { fifteenSquaredBlack, fifteenSquaredBlue } from 'src/app/ui/common';
import { ITextStyle, TextStyleName } from '../interfaces';

export class TextStyle implements ITextStyle {
        public readonly name: TextStyleName;
        public readonly color: string;
        public readonly bold: boolean;
        public readonly italic: boolean;
        public readonly underline: boolean;
        public readonly class: string;

        constructor(data) {
            this.name = data.name;
            this.color = data.color || data.name === "answer" ? fifteenSquaredBlack : fifteenSquaredBlue;
            this.bold = data.bold || false;
            this.italic = data.italic || false;
            this.underline = data.underline || false;
            this.class = data.class || `fts-${data.name}`;
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

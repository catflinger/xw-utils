import { ITextStyle } from 'src/app/model/interfaces';

export class TextStyleM implements ITextStyle {
    color: string;
    bold: boolean;
    italic: boolean;
    underline: boolean;
}

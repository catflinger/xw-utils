import { ITextStyle } from 'src/app/model/interfaces';

export abstract class TextStyleM implements ITextStyle {
    public abstract color: string;
    public abstract bold: boolean;
    public abstract italic: boolean;
    public abstract underline: boolean;
}

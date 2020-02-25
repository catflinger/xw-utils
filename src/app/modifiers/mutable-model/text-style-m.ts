import { ITextStyle, TextStyleName } from 'src/app/model/interfaces';

export abstract class TextStyleM implements ITextStyle {
    public abstract name: TextStyleName;
    public abstract color: string;
    public abstract bold: boolean;
    public abstract italic: boolean;
    public abstract underline: boolean;
}

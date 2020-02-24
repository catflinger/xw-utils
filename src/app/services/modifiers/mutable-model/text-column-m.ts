import { ITextColumn, TextStyleName } from 'src/app/model/interfaces';
import { TextStyleM } from './text-style-m';

export abstract class TextColumnM implements ITextColumn {
    public abstract caption: string;
    public abstract style: TextStyleName;
}
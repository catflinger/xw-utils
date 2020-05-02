import { ITextColumn, TextStyleName } from '../interfaces'

export class TextColumn implements ITextColumn {
    public readonly caption: string;    
    public readonly style: TextStyleName;

    constructor(data: any) {
        this.caption = data.caption;
        this.style = data.style;
    }
}
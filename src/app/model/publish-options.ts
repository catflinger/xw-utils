import { TextStyle, ITextStyle } from './text-style';

export interface IPublishOptions {
    answerStyle: ITextStyle;
    clueStyle: ITextStyle;
    definitionStyle: ITextStyle;
}

export class PublishOptions implements IPublishOptions {
    
    public readonly answerStyle: TextStyle;
    public readonly clueStyle: TextStyle;
    public readonly definitionStyle: TextStyle;

    constructor(data) {
        this.answerStyle = new TextStyle(data.answerStyle);
        this.clueStyle   = new TextStyle(data.clueStyle);
        this.definitionStyle = new TextStyle(data.definitionStyle);
     }
}
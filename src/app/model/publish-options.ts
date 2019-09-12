import { TextStyle } from './text-style';
import { IPublishOptions } from './interfaces';


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
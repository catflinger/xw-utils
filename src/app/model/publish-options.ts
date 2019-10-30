import { TextStyle } from './text-style';
import { IPublishOptions, Layouts } from './interfaces';


export class PublishOptions implements IPublishOptions {
    
    public readonly answerStyle: TextStyle;
    public readonly clueStyle: TextStyle;
    public readonly definitionStyle: TextStyle;
    public readonly includeGrid: boolean;
    public readonly layout: Layouts;

    constructor(data) {
        this.answerStyle = new TextStyle(data.answerStyle);
        this.clueStyle   = new TextStyle(data.clueStyle);
        this.definitionStyle = new TextStyle(data.definitionStyle);
        this.includeGrid = data.includeGrid;
        this.layout = data.layout ? data.layout : "table";
     }
}
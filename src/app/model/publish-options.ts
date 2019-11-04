import { TextStyle } from './text-style';
import { IPublishOptions, Layouts, Spacings } from './interfaces';


export class PublishOptions implements IPublishOptions {
    
    public readonly answerStyle: TextStyle;
    public readonly clueStyle: TextStyle;
    public readonly definitionStyle: TextStyle;
    public readonly includeGrid: boolean;
    public readonly layout: Layouts;
    public readonly spacing: Spacings;


    constructor(data) {
        this.answerStyle = data.answerStyle ? new TextStyle(data.answerStyle) : null;
        this.clueStyle  = data.clueStyle ? new TextStyle(data.clueStyle) : null;
        this.definitionStyle = data.definitionStyle ? new TextStyle(data.definitionStyle) : null;
        this.includeGrid = !!(data.includeGrid);
        this.layout = data.layout ? data.layout : "table";
        this.spacing = data.spacing ? data.spacing : "medium";
     }
}
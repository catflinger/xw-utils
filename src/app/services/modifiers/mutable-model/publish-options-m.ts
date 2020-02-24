import { IPublishOptions, Layouts, Spacing } from 'src/app/model/interfaces';
import { TextStyleM } from './text-style-m';
import { TextColumnM } from './text-column-m';

export abstract class PublishOptionsM implements IPublishOptions {
    // public abstract answerStyle: TextStyleM;
    // public abstract clueStyle: TextStyleM;
    // public abstract definitionStyle: TextStyleM;
    public abstract textStyles: TextStyleM[];
    public abstract textCols: TextColumnM[]; 
    public abstract includeGrid: boolean;
    public abstract layout: Layouts;
    public abstract spacing: Spacing;
    // public abstract modifyAnswers: boolean;
}
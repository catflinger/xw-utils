import { IPublishOptions, Layouts } from 'src/app/model/interfaces';
import { TextStyleM } from './text-style-m';

export abstract class PublishOptionsM implements IPublishOptions {
    public abstract answerStyle: TextStyleM;
    public abstract clueStyle: TextStyleM;
    public abstract definitionStyle: TextStyleM;
    public abstract includeGrid: boolean;
    public abstract layout: Layouts;
}
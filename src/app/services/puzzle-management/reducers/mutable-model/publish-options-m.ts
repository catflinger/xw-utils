import { IPublishOptions } from 'src/app/model/interfaces';
import { TextStyleM } from './text-style-m';

export class PublishOptionsM implements IPublishOptions {
    
    public answerStyle: TextStyleM;
    public clueStyle: TextStyleM;
    public definitionStyle: TextStyleM;
}
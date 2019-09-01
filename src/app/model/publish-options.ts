import { TextStyle, ITextStyle } from './text-style';

export interface IPublishOptions {
    clueStyle: ITextStyle;
    definitionStyle: ITextStyle;
    answerStyle: ITextStyle;
}

export class PublishOptions implements IPublishOptions {
    constructor(
        public readonly clueStyle: TextStyle,
        public readonly definitionStyle: TextStyle,
        public readonly answerStyle: TextStyle,
    ) { }
}
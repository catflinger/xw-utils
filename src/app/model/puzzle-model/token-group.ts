import { ITokenGroup, IParseToken } from '../interfaces';

export class TokenGroup implements ITokenGroup {
    public readonly previous: IParseToken;
    public readonly current: IParseToken;
    public readonly next: IParseToken;

    constructor(data: any) {
        if (data) {
            if (data.previous) {
                this.previous = {
                    text: data.previous.text,
                    lineNumber: data.previous.lineNumber,
                    type: data.previous.type,
                }
            }
            if (data.current) {
                this.current = {
                    text: data.current.text,
                    lineNumber: data.current.lineNumber,
                    type: data.current.type,
                }
            }
            if (data.next) {
                this.next = {
                    text: data.next.text,
                    lineNumber: data.next.lineNumber,
                    type: data.next.type,
                }
            }
        };
    }
}

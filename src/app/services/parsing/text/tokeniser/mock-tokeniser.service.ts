import { Injectable } from '@angular/core';
import { TokenList, TokeniserService } from './tokeniser.service';
import { IParseToken } from 'src/app/model/interfaces';

@Injectable({
  providedIn: 'root'
})
export class MockTokeniserService extends TokeniserService {
    public tokens: any[] = [];

    public parse(data: string): TokenList {
        return new TokenList(this.tokens);
    }

    public setTestData(tokens: IParseToken[]) {
        this.tokens = tokens;
    }
}

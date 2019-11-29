import { Injectable } from '@angular/core';
import { Line } from '../line';
import { ParseToken } from './tokens';
import { TokeniserOptions, TokenList, TokeniserService } from './tokeniser.service';

@Injectable({
  providedIn: 'root'
})
export class MockTokeniserService extends TokeniserService {
    public tokens: any[] = [];

    public parse(lines: ReadonlyArray<Line>, options: TokeniserOptions): TokenList {
        return new TokenList(this.tokens);
    }

    public setTestData(tokens: ParseToken[]) {
        this.tokens = tokens;
    }
}

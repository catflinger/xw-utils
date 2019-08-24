import { Injectable } from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Puzzle } from '../model/puzzle';

//const host = "localhost:49323";
const host = "drurys2.org/getpuzzle.ashx";

@Injectable({
    providedIn: 'root'
})
export class HttpPuzzleService {

    constructor(private http: HttpClient) { }

    public getPuzzle(provider: string): Promise<Puzzle> {
        return this.http.get(`http://${host}/getpuzzle.ashx?u=public&p=public&provider=${provider}`)
        .toPromise()
        .then((json) => {
            return new Puzzle(json);
        });
//        .catch((error) => error);
    }
}

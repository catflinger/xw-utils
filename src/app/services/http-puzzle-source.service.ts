import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Puzzle } from '../model/puzzle';

@Injectable({
  providedIn: 'root'
})
export class HttpPuzzleSourceService {

    constructor(private http: HttpClient) { }

    public getPuzzle(provider: string): Promise<Puzzle> {
        return this.http.get("http://localhost:49323/getpuzzle?u=public&p=public&provider=" + provider)
        .toPromise()
        .then( (data) => {
            return new Puzzle(data);
         })
         .catch((error) => {
             throw new Error("Failed to load puzzle");
         });
    }

    public putPuzzle(puzzle: Puzzle): Promise<any> {
        return Promise.resolve();
    }
}


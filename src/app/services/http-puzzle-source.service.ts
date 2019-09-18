import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Puzzle } from '../model/puzzle';

interface LatestPuzzleResult {
    success: boolean;
    message: string;
    puzzle: any;
}

@Injectable({
  providedIn: 'root'
})
export class HttpPuzzleSourceService {

    constructor(private http: HttpClient) { }

    public getPuzzle(provider: string): Promise<Puzzle> {
        return this.http.get("http://localhost:49323/api/latestpuzzle/" + provider)
        .toPromise()
        .then( (data: LatestPuzzleResult) => {
            if (data.success) {
                return new Puzzle(data.puzzle);
            } else {
                throw new Error(data.message);
            }
         })
         .catch((error) => {
             throw new Error("Failed to get puzzle");
         });
    }

    public putPuzzle(puzzle: Puzzle): Promise<any> {
        return Promise.resolve();
    }
}


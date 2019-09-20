import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Puzzle } from '../model/puzzle';

interface LatestPuzzleResult {
    success: boolean;
    message: string;
    puzzle: any;
}

interface LatestPuzzleRequest {
    provider: string;
    username: string;
    password: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpPuzzleSourceService {

    constructor(private http: HttpClient) { }

    public getPuzzle(provider: string): Promise<Puzzle> {
        const request: LatestPuzzleRequest = {
            provider: provider,
            username: "PeeDee",
            password: "te&&ndt0&st",
        };

        return this.http.post("http://localhost:49323/api/latestpuzzle/", request)
        .toPromise()
        .then( (data: LatestPuzzleResult) => {
            if (data.success) {
                return new Puzzle(data.puzzle);
            } else {
                throw new Error(data.message);
            }
         });
    }

    public putPuzzle(puzzle: Puzzle): Promise<any> {
        return Promise.resolve();
    }
}


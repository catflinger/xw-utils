import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Puzzle } from '../model/puzzle';
import { ApiResponse, ApiResponseStatus } from './common';
import { AuthService } from './auth.service';

abstract class LatestPuzzleResponse implements ApiResponse {
    public abstract success: ApiResponseStatus;
    public abstract message: string;
    public abstract puzzle: any;
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

    constructor(
        private http: HttpClient,
        private authService: AuthService) { }

    public getPuzzle(provider: string): Promise<LatestPuzzleResponse> {
        const credentials = this.authService.getCredentials();

        const request: LatestPuzzleRequest = {
            provider: provider,
            username: credentials.username,
            password: credentials.password,
        };

        return this.http.post("http://localhost:49323/api/latestpuzzle/", request)
        .toPromise()
        .then(data => data as LatestPuzzleResponse);
    }

    public putPuzzle(puzzle: Puzzle): Promise<any> {
        return Promise.resolve();
    }
}


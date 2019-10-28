import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Puzzle } from '../model/puzzle';
import { ApiResponse, ApiResponseStatus, ApiSymbols } from './common';
import { AuthService } from './auth.service';
import { ArchiveItem } from '../model/archive-item';
import { environment } from "../../environments/environment";
import { PuzzleProvider } from '../model/interfaces';

export abstract class PuzzleResponse implements ApiResponse {
    public abstract success: ApiResponseStatus;
    public abstract message: string;
    public abstract puzzle: any;
}

interface LatestPuzzleRequest {
    provider: PuzzleProvider;
    username: string;
    password: string;
}

interface ArchivePuzzleRequest {
    username: string;
    password: string;
    provider: PuzzleProvider;
    url: string;
    serialNumber: number;
    date: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpPuzzleSourceService {

    constructor(
        private http: HttpClient,
        private authService: AuthService) { }

    public getLatestPuzzle(provider: PuzzleProvider): Promise<PuzzleResponse> {
        const credentials = this.authService.getCredentials();

        if (!credentials.authenticated) {
            return Promise.reject(ApiSymbols.AuthorizationFailure);
        }

        const request: LatestPuzzleRequest = {
            provider: provider,
            username: credentials.username,
            password: credentials.password,
        };

        return this.http.post(environment.apiRoot + "latestpuzzle/", request)
        .toPromise()
        .then(data => data as PuzzleResponse);
    }

    public getArchivePuzzle(item: ArchiveItem): Promise<PuzzleResponse> {
        const credentials = this.authService.getCredentials();

        if (!credentials.authenticated) {
            return Promise.reject(ApiSymbols.AuthorizationFailure);
        }

        const request: ArchivePuzzleRequest = {
            provider: item.provider,
            url: item.url,
            serialNumber: item.serialNumber,
            date: item.date.toISOString(),
            username: credentials.username,
            password: credentials.password,
        };

        return this.http.post(environment.apiRoot + "archivepuzzle/", request)
        .toPromise()
        .then(data => data as PuzzleResponse);
    }

    public putPuzzle(puzzle: Puzzle): Promise<any> {
        return Promise.resolve();
    }
}


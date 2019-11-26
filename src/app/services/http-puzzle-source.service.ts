import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Puzzle } from '../model/puzzle';
import { ApiResponse, ApiResponseStatus, ApiSymbols } from './common';
import { AuthService } from './auth.service';
import { ArchiveItem } from '../model/archive-item';
import { environment } from "../../environments/environment";
import { PuzzleProvider } from '../model/interfaces';
import moment from 'moment';
import { OpenPuzzleParamters } from '../ui/services/app.service';

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

interface PdfPuzzleRequest {
    content: string;
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

    public getArchivePuzzle(params: OpenPuzzleParamters): Promise<PuzzleResponse> {
        const credentials = this.authService.getCredentials();

        if (!credentials.authenticated) {
            return Promise.reject(ApiSymbols.AuthorizationFailure);
        }

        params.username = credentials.username;
        params.password = credentials.password;

        return this.http.post(environment.apiRoot + "puzzle/", params)
        .toPromise()
        .then(data => data as PuzzleResponse)
        .catch(error => { throw error.message });
    }

    public getPdfPuzzle(pdf: string): Promise<PuzzleResponse> {
        const credentials = this.authService.getCredentials();

        if (!credentials.authenticated) {
            return Promise.reject(ApiSymbols.AuthorizationFailure);
        }

        const request: PdfPuzzleRequest = {
            content: pdf,
            username: credentials.username,
            password: credentials.password,
        };

        return this.http.post(environment.apiRoot + "pdfpuzzle/", request)
        .toPromise()
        .then(data => data as PuzzleResponse);
    }

    public putPuzzle(puzzle: Puzzle): Promise<any> {
        return Promise.resolve();
    }
}


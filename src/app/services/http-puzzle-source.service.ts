import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, ApiResponseStatus, ApiSymbols } from './common';
import { AuthService } from './auth.service';
import { environment } from "../../environments/environment";
import { OpenPuzzleParamters } from '../ui/services/app.service';

export abstract class PuzzleResponse implements ApiResponse {
    public abstract success: ApiResponseStatus;
    public abstract message: string;
    public abstract puzzle: any;
    public abstract warnings: any;
    public abstract completionState: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpPuzzleSourceService {

    constructor(
        private http: HttpClient,
        private authService: AuthService) { }

    public getPuzzle(params: OpenPuzzleParamters): Promise<PuzzleResponse> {
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
}


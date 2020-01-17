import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, ApiResponseStatus, ApiSymbols } from './common';
import { AuthService } from './auth.service';
import { environment } from "../../environments/environment";
import { OpenPuzzleParamters } from '../ui/services/app.service';
import { Base64Encoded } from '../model/interfaces';

abstract class ApiPdfExtractResponse implements ApiResponse {
    public abstract success: ApiResponseStatus;
    public abstract message: string;
    public abstract grid: any;
    public abstract text: string;
}

abstract class ApiPuzzleResponse implements ApiResponse {
    public abstract success: ApiResponseStatus;
    public abstract message: string;
    public abstract puzzle: any;
    public abstract warnings: any;
    public abstract completionState: string;
}

export interface PuzzleResponse {
    readonly puzzle: any;
    readonly warnings: any;
    readonly completionState: string;
}

export interface PdfExtractResponse {
    readonly grid: any;
    readonly text: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpPuzzleSourceService {

    constructor(
        private http: HttpClient,
        private authService: AuthService) { }

        // TO DO: changeteh name of this and make it more generic
        public getFT(params: OpenPuzzleParamters): Promise<PdfExtractResponse> {
            const credentials = this.authService.getCredentials();
    
            if (!credentials.authenticated) {
                return Promise.reject(ApiSymbols.AuthorizationFailure);
            }
    
            params.username = credentials.username;
            params.password = credentials.password;
    
            return this.http.post(environment.apiRoot + "Ft/", params)
            .toPromise()
            .then((data: ApiPdfExtractResponse) => {
                if (data.success === ApiResponseStatus.OK) {
                    return data as PdfExtractResponse;
                } else if (data.success === ApiResponseStatus.authorizationFailure) {
                    throw ApiSymbols.AuthorizationFailure;
                } else {
                    throw data.message;
                }
            });
        }
    
        public getPuzzle(params: OpenPuzzleParamters): Promise<PuzzleResponse> {
        const credentials = this.authService.getCredentials();

        if (!credentials.authenticated) {
            return Promise.reject(ApiSymbols.AuthorizationFailure);
        }

        params.username = credentials.username;
        params.password = credentials.password;

        return this.http.post(environment.apiRoot + "puzzle/", params)
        .toPromise()
        .then((data: ApiPuzzleResponse) => {
            if (data.success === ApiResponseStatus.OK) {
                return data as PuzzleResponse;
            } else if (data.success === ApiResponseStatus.authorizationFailure) {
                throw ApiSymbols.AuthorizationFailure;
            } else {
                throw data.message;
            }
        });
    }

    public getPdfExtract(pdf: Base64Encoded): Promise<PdfExtractResponse> {
        const credentials = this.authService.getCredentials();

        if (!credentials.authenticated) {
            return Promise.reject(ApiSymbols.AuthorizationFailure);
        }

        let params: any = {
            username: credentials.username,
            password: credentials.password,
            sourceDataB64: pdf,
        }

        return this.http.post(environment.apiRoot + "pdfextract/", params)
        .toPromise()
        .then((data: ApiPdfExtractResponse) => {
            if (data.success === ApiResponseStatus.OK) {
                return data as PdfExtractResponse;
            } else if (data.success === ApiResponseStatus.authorizationFailure) {
                throw ApiSymbols.AuthorizationFailure;
            } else {
                throw data.message;
            }
        });
    }
}


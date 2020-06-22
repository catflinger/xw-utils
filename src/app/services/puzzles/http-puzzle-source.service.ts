import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, ApiResponseStatus, AppResultSymbols, getApiRoot } from '../common';
import { AuthService } from '../app/auth.service';
import { OpenPuzzleParamters } from '../../ui/general/app.service';
import { Base64Encoded } from '../../model/interfaces';

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
    readonly grid?: any;
    readonly text: string;
}

@Injectable({
  providedIn: 'root'
})
export class HttpPuzzleSourceService {

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) { }

    public providePuzzle(params: OpenPuzzleParamters): Promise<PdfExtractResponse> {
        const credentials = this.authService.getCredentials();

        if (!credentials.authenticated) {
            return Promise.reject(AppResultSymbols.AuthorizationFailure);
        }

        params.username = credentials.username;
        params.password = credentials.password;

        return this.http.post(getApiRoot() + "provision/", params)
        .toPromise()
        .then((data: ApiPdfExtractResponse) => {
            if (data.success === ApiResponseStatus.OK) {
                return data as PdfExtractResponse;
            } else if (data.success === ApiResponseStatus.authorizationFailure) {
                throw AppResultSymbols.AuthorizationFailure;
            } else {
                throw data.message;
            }
        });
    }

    public getPuzzle(params: OpenPuzzleParamters): Promise<PuzzleResponse> {
        const credentials = this.authService.getCredentials();

        if (!credentials.authenticated) {
            return Promise.reject(AppResultSymbols.AuthorizationFailure);
        }

        params.username = credentials.username;
        params.password = credentials.password;

        return this.http.post(getApiRoot() + "puzzle/", params)
        .toPromise()
        .then((data: ApiPuzzleResponse) => {
            if (data.success === ApiResponseStatus.OK) {
                return data as PuzzleResponse;
            } else if (data.success === ApiResponseStatus.authorizationFailure) {
                throw AppResultSymbols.AuthorizationFailure;
            } else {
                throw data.message;
            }
        });
    }

    public getPdfExtract(pdf: Base64Encoded, gridPage: number, textPage: number): Promise<PdfExtractResponse> {
        const credentials = this.authService.getCredentials();

        if (!credentials.authenticated) {
            return Promise.reject(AppResultSymbols.AuthorizationFailure);
        }

        let params: any = {
            username: credentials.username,
            password: credentials.password,
            sourceDataB64: pdf,
            gridPage,
            textPage,
        }

        return this.http.post(getApiRoot() + "pdfextract/", params)
        .toPromise()
        .then((data: ApiPdfExtractResponse) => {
            if (data.success === ApiResponseStatus.OK) {
                return data as PdfExtractResponse;
            } else if (data.success === ApiResponseStatus.authorizationFailure) {
                throw AppResultSymbols.AuthorizationFailure;
            } else {
                throw data.message;
            }
        });
    }

    public housekeep(): Promise<void> {
        const credentials = this.authService.getCredentials();

        if (!credentials.authenticated) {
            return Promise.reject(AppResultSymbols.AuthorizationFailure);
        }

        let params: any = {
            username: credentials.username,
            password: credentials.password,
        }

        return this.http.post(getApiRoot() + "admin/", params)
        .toPromise()
        .then((data: ApiPdfExtractResponse) => {
            if (data.success === ApiResponseStatus.OK) {
                return;
            } else if (data.success === ApiResponseStatus.authorizationFailure) {
                throw AppResultSymbols.AuthorizationFailure;
            } else {
                throw data.message;
            }
        });
    }

}


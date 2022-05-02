import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { HttpClient } from '@angular/common/http';
import { AppResultSymbols, ApiResponse, ApiResponseStatus, getApiRoot } from '../common';
import { Diary } from '../../model/diary-model/diary';
import { BehaviorSubject, Observable } from 'rxjs';

export abstract class DiaryResponse implements ApiResponse {
    public abstract success: ApiResponseStatus;
    public abstract message: string;
    public abstract entries: any;
}

interface DiaryRequest {
    username: string;
    password: string;
}

@Injectable({
    providedIn: 'root'
})
export class DiaryService {
    private bs: BehaviorSubject<Diary>;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.bs = new BehaviorSubject<Diary>(null);
    }

    public observe(): Observable<Diary> {
        return this.bs.asObservable();
    }

    public refresh(): Promise<Symbol> {
        const credentials = this.authService.getCredentials();

        if (!credentials.authenticated) {
            return Promise.reject(AppResultSymbols.AuthorizationFailure);
        }

        const request: DiaryRequest = {
            username: credentials.username,
            password: credentials.password,
        };

        return this.http.post(getApiRoot() + "diary/", request)
        .toPromise()
        .then((data: DiaryResponse) => {
            if (data.success === ApiResponseStatus.authorizationFailure) {
                return AppResultSymbols.AuthorizationFailure;
            } else if (data.success === ApiResponseStatus.OK) {
                this.bs.next(new Diary(data));
                return AppResultSymbols.OK
            } else {
                return AppResultSymbols.Error;
            }
        })
        .catch(() => {
            return AppResultSymbols.Error;
        });
    }
}

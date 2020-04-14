import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiResponse, ApiResponseStatus, ApiSymbols } from '../common';
import { environment } from 'src/environments/environment';
import { AppSettingsService } from './app-settings.service';

export class Credentials {
    constructor(
        public readonly username: string,
        public readonly password: string,
        public readonly authenticated: boolean,
    ) { }
}

const defaultCredentials: Credentials = new Credentials("", "", false);

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private bs: BehaviorSubject<Credentials> = new BehaviorSubject<Credentials>(defaultCredentials);

    constructor(
        private http: HttpClient,
        private settingsService: AppSettingsService) { }

    public observe(): Observable<Credentials> {
        return this.bs.asObservable();
    }

    public getCredentials(): Credentials {
        return this.bs.value;
    }

    public authenticate(username: string, password: string): Promise<void> {
        return this.http.post(environment.apiRoot + "authorization/", { username, password, sandbox: this.settingsService.settings.sandbox})
        .toPromise()
        .then((data: ApiResponse) => {
            if (data.success === ApiResponseStatus.OK) {
                this.settingsService.username = username;
                this.bs.next(new Credentials(username, password, true));
            } else {
                this.clearCredentials();
                throw ApiSymbols.AuthorizationFailure;
            }
        })
        .catch((error) => {
            this.clearCredentials();
            throw error;
        });
    }

    public clearCredentials(): void {
        this.bs.next(new Credentials(this.settingsService.username, "", false));
    }

}

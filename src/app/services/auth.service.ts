import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, timer } from 'rxjs';
import { ApiResponse, ApiResponseStatus, ApiSymbols } from './common';

export class Credentials {
    constructor(
        public readonly username: string,
        public readonly password: string,
    ) { }
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    // private credential: Credentials = null;
    private bs: BehaviorSubject<Credentials> = new BehaviorSubject<Credentials>(null);

    constructor(private http: HttpClient) { }

    public observe(): Observable<Credentials> {
        return this.bs.asObservable();
    }

    public getCredentials(): Credentials {
        return this.bs.value;
    }

    public authenticate(username: string, password: string): Promise<void> {
        return this.http.post("http://localhost:49323/api/authorization/", { username, password})
        .toPromise()
        .then((data: ApiResponse) => {
            if (data.success === ApiResponseStatus.OK) {
                this.bs.next(new Credentials(username,password));
            } else {
                this.clearCredentials();
                throw ApiSymbols.AuthorizationFailure;
            }
        })
        .catch((error) => {
            this.clearCredentials();
            throw error.toString();
        });
    }

    public clearCredentials(): void {
        this.bs.next(null);
    }

}

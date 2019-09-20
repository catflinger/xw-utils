import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface AuthResponse {
    success: boolean;
    token: string;
}

class Credentials {
    constructor(
        public readonly username: string,
        public readonly password: string,
    ) { }
}

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private credential: Credentials = null;

    constructor() { }

    public getCredentials(): Credentials {
        return this.credential;
    }

    public setCredentials(username: string, password: string): void {
        this.credential = new Credentials(username,password);
    }

    public clearCredentials(): void {
        this.credential = null;
    }

}

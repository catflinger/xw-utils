import { Injectable } from '@angular/core';
import { AuthService } from '../app/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiResponseStatus, ApiSymbols } from '../common';
import { BackupInfo } from './backup-info';

interface IPuzzleBackupInfo
{
    id: string;
    caption: string;
    origin: string;
    owner: string;
    date: string;
    contentType: string;
    content?: string;
}

interface IApiResult {
    success: ApiResponseStatus;
    message: string;
}

interface IPuzzleBackupResult {
    success: ApiResponseStatus;
    message: string;
    backups: IPuzzleBackupInfo[];
}

interface IPuzzleBackupRequest {
    username: string;
    password: string;
    backup: {
        caption: string;
        origin: string;
        owner: string;
        contentType: string;
        content: string;
    }
}

@Injectable({
    providedIn: 'root'
})
export class HttpBackupSourceService {

    constructor(
        private authService: AuthService,
        private http: HttpClient,
    ) { }

    public getBackupList(owner: string): Promise<BackupInfo[]> {
        // request the info from the server
        // check the response for auth failure and reject with special error token
        // resolve with data
        
        return this.http.get(environment.apiRoot + `user/${owner}/backup`)
        .toPromise()
        .then((response: IPuzzleBackupResult) => {

            if (response.success === ApiResponseStatus.OK) {
                return response.backups
                    .map(b => new BackupInfo(b))
                    .sort((a,b) => b.date.getTime() - a.date.getTime());
            } else if (response.success === ApiResponseStatus.authorizationFailure) {
                throw ApiSymbols.AuthorizationFailure;
            } else {
                throw "Error trying to get backups: " + response.message;
            }
        });
    }

    public getBackup(id: string): Promise<IPuzzleBackupInfo> {
        return this.http.get(environment.apiRoot + `backup/${id}`)
        .toPromise()
        .then((response: IPuzzleBackupResult) => {
            
            if (response.success === ApiResponseStatus.OK) {
                if (response.backups.length === 0) {
                    throw "No backup found with this id";
                }
                return response.backups[0];
            } else if (response.success === ApiResponseStatus.authorizationFailure) {
                throw ApiSymbols.AuthorizationFailure;
            } else {
                throw "Error trying to get backups: " + response.message;
            }
        });
    }

    public addBackup(caption: string, origin: string, contentType: string, content: string): Promise<any> {
        const creds = this.authService.getCredentials();

        const data: IPuzzleBackupRequest = {
            username: creds.username,
            password: creds.password,
            backup: {
                owner: creds.username,
                caption: caption,
                origin: origin,
                contentType: contentType,
                content: content
            }
        }

        console.log("Sending backup...");
        
        return this.http.post(environment.apiRoot + "backup", data)
        .toPromise()
        .then((response: IApiResult) => {
            if (response.success === ApiResponseStatus.OK) {
                return null;
            } else if (response.success === ApiResponseStatus.authorizationFailure) {
                throw ApiSymbols.AuthorizationFailure;
            } else {
                throw "Error trying to get backups: " + response.message;
            }
        });
    }

    public deleteBackup(id: string): Promise<void> {
        return this.http.delete(environment.apiRoot + `backup/${id}`)
        .toPromise()
        .then((response: IApiResult) => {
            if (response.success === ApiResponseStatus.OK) {
                return null;
            } else if (response.success === ApiResponseStatus.authorizationFailure) {
                throw ApiSymbols.AuthorizationFailure;
            } else {
                throw "Error trying to get delete backup: " + response.message;
            }
        });
    }

}

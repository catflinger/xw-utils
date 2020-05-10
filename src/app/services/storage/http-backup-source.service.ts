import { Injectable } from '@angular/core';
import { AuthService } from '../app/auth.service';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { ApiResponseStatus, ApiSymbols } from '../common';
import { BackupInfo, BackupType, BackupContentType } from './backup-info';

interface HttpPuzzleBackupInfo
{
    id: string;
    caption: string;
    origin: string;
    owner: string;
    date: string;
    backupType: BackupType;
    contentType: string;
    content?: string;
}

interface HttpApiResult {
    success: ApiResponseStatus;
    message: string;
}

interface HttpApiRequest {
    username: string;
    password: string;
}

interface HttpPuzzleBackupResult {
    success: ApiResponseStatus;
    message: string;
    backups: HttpPuzzleBackupInfo[];
}

interface HttpPuzzleBackupRequest {
    username: string;
    password: string;
    backup: {
        caption: string;
        origin: string;
        owner: string;
        backupType: string;
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
        .then((response: HttpPuzzleBackupResult) => {

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

    public getBackup(id: string): Promise<BackupInfo> {
        return this.http.get(environment.apiRoot + `backup/${id}`)
        .toPromise()
        .then((response: HttpPuzzleBackupResult) => {
            
            if (response.success === ApiResponseStatus.OK) {
                if (response.backups.length === 0) {
                    throw "No backup found with this id";
                }
                return new BackupInfo(response.backups[0]);
            } else if (response.success === ApiResponseStatus.authorizationFailure) {
                throw ApiSymbols.AuthorizationFailure;
            } else {
                throw "Error trying to get backups: " + response.message;
            }
        });
    }

    public addBackup(caption: string, origin: string, backupType: BackupType, contentType: BackupContentType, content: string): Promise<any> {
        const creds = this.authService.getCredentials();

        const data: HttpPuzzleBackupRequest = {
            username: creds.username,
            password: creds.password,
            backup: {
                owner: creds.username,
                caption,
                origin,
                backupType,
                contentType,
                content,
            }
        }

        return this.http.post(environment.apiRoot + "backup", data)
        .toPromise()
        .then((response: HttpApiResult) => {
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
        const creds = this.authService.getCredentials();
        const body: HttpApiRequest = {
            username: creds.username,
            password: creds.password,
        }
        return this.http.request(
            "delete", 
            environment.apiRoot + `backup/${id}`, 
            {body: body}
        ).toPromise()
        .then((response: HttpApiResult) => {
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

import { Injectable, InjectionToken } from '@angular/core';
import { AuthService } from '../app/auth.service';
import { HttpClient } from '@angular/common/http';
import { ApiResponseStatus, AppResultSymbols, getApiRoot } from '../common';
import { BackupInfo, BackupType, BackupContentType } from './backup-info';
import { TraceService } from '../app/trace.service';
import { AppSettingsService } from '../app/app-settings.service';

interface HttpPuzzleBackupInfo
{
    id: string;
    caption: string;
    origin: string;
    owner: string;
    date: string;
    backupType: BackupType;
    contentId: string;
    contentType: string;
    content?: string;
    host?: string;
}

interface HttpApiResult {
    success: ApiResponseStatus;
    message: string;
}

interface HttpApiRequest {
    username: string;
    password: string;
    sandbox:boolean;
}

interface HttpPuzzleBackupResult {
    success: ApiResponseStatus;
    message: string;
    backups: HttpPuzzleBackupInfo[];
}

interface HttpPuzzleBackupRequest {
    username: string;
    password: string;
    sandbox: boolean;
    backup: {
        caption: string;
        origin: string;
        owner: string;
        backupType: string;
        contentId: string;
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
        private trace: TraceService,
        private settingsService: AppSettingsService
    ) { }

    public getBackupList(host: string, owner: string): Promise<BackupInfo[]> {
        // request the info from the server
        // check the response for auth failure and reject with special error token
        // resolve with data

        const url = `https://${host}/api/user/${owner}/backup`;
        
        this.trace.log("Requesting backup list for [" + url + "]");

        return this.http.get(url)
        .toPromise()
        .then((response: HttpPuzzleBackupResult) => {

            this.trace.logJason(response);
            
            if (response.success === ApiResponseStatus.OK) {
                return response.backups
                    .map(b => new BackupInfo(b))
                    .sort((a,b) => b.date.getTime() - a.date.getTime());
            } else if (response.success === ApiResponseStatus.authorizationFailure) {
                throw AppResultSymbols.AuthorizationFailure;
            } else {
                throw "Error trying to get backups: " + response.message;
            }
        });
    }

    public getBackup(host: string, id: string): Promise<BackupInfo> {
        return this.http.get(`https://${host}/api/backup/${id}`)
        .toPromise()
        .then((response: HttpPuzzleBackupResult) => {
            
            if (response.success === ApiResponseStatus.OK) {
                if (response.backups.length === 0) {
                    throw "No backup found with this id";
                }
                return new BackupInfo(response.backups[0]);
            } else if (response.success === ApiResponseStatus.authorizationFailure) {
                throw AppResultSymbols.AuthorizationFailure;
            } else {
                throw "Error trying to get backups: " + response.message;
            }
        });
    }

    public addBackup(
        caption: string, 
        origin: string, 
        backupType: BackupType, 
        contentId: string, 
        contentType: BackupContentType, 
        content: string,
        ): Promise<any> {
        
            const creds = this.authService.getCredentials();

        const data: HttpPuzzleBackupRequest = {
            username: creds.username,
            password: creds.password,
            sandbox: this.settingsService.settings.sandbox,
            backup: {
                owner: creds.username,
                caption,
                origin,
                backupType,
                contentId,
                contentType,
                content,
            }
        }

        return this.http.post(getApiRoot() + "backup", data)
        .toPromise()
        .then((response: HttpApiResult) => {
            if (response.success === ApiResponseStatus.OK) {
                return null;
            } else if (response.success === ApiResponseStatus.authorizationFailure) {
                throw AppResultSymbols.AuthorizationFailure;
            } else {
                throw "Error trying to get backups: " + response.message;
            }
        });
    }

    public deleteBackup(host: string, id: string): Promise<void> {
        const creds = this.authService.getCredentials();
        const body: HttpApiRequest = {
            username: creds.username,
            password: creds.password,
            sandbox: this.settingsService.settings.sandbox
        }
        return this.http.put(
            getApiRoot() + `backup/${id}`, 
            body).toPromise()
        .then((response: HttpApiResult) => {
            if (response.success === ApiResponseStatus.OK) {
                return null;
            } else if (response.success === ApiResponseStatus.authorizationFailure) {
                throw AppResultSymbols.AuthorizationFailure;
            } else {
                throw "Error trying to delete backup: " + response.message;
            }
        });
    }

}

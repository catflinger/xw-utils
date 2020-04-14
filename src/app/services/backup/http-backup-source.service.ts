import { Injectable } from '@angular/core';
import { BackupPackageInfo } from './backup.service';
import { AuthService } from '../app/auth.service';

@Injectable({
    providedIn: 'root'
})
export class HttpBackupSourceService {

    constructor(
        private authService: AuthService,
    ) { }

    public getBackupList(): Promise<BackupPackageInfo[]> {
        // request the info from the server
        // check the response for auth failure and reject with special error token
        // resolve with data
        return Promise.resolve([]);
    }

    public saveBackup(info: BackupPackageInfo, data: any): Promise<void> {
        // send the info the server
        // check the response for auth failure and reject with special error token
        // resolve with data
        return Promise.resolve();
    }
}

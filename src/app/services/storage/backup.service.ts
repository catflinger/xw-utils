import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpBackupSourceService } from './http-backup-source.service';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { BackupInfo } from './backup-info';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from '../app/auth.service';

// export type MergeAction = "skip" | "replace";

// export interface BackupOptions {
//     foo: boolean;
// }

// export interface RestoreOptions {
//     mergeAction: MergeAction; // what to do for conflicts
// }

@Injectable({
    providedIn: 'root'
})
export class BackupService {

    private _bsBackupList = new BehaviorSubject<BackupInfo[]>([]);

    constructor(
        private backupStore: HttpBackupSourceService,
        private localStorage: LocalStorageService,
        private authService: AuthService,
    ) {
        this.refresh();
    }

    public refresh() {
        const creds = this.authService.getCredentials();

        if (creds.authenticated) {
            this.backupStore.getBackupList(creds.username)
            .then(list => {
                this._bsBackupList.next(list);
            })
        }
    }

    public observe(): Observable<BackupInfo[]> {
        return this._bsBackupList.asObservable();
    }

    public backupPuzzle(id: string): Promise<void> {

        const creds = this.authService.getCredentials();

        if (creds.authenticated) {
            return this.localStorage.getPuzzle(id)
            .then(puzzle => {
                return this.backupStore.addBackup(
                    puzzle.info.title, 
                    "my computer", 
                    "json", 
                    JSON.stringify(puzzle));
            })
            .then(()=> this.refresh());
    
        } else {
            console.log("NOT AUTHENTICATED!")
            // TO DO
        }
        return Promise.resolve();
    }

    public restorePuzzle(id: string): Promise<void> {
        // 0) check if logged in
        // 1) find the package info matching the id
        // 2) get the payload for this package from the backpStore
        // 3) apply the changes requested in the options

        return Promise.resolve();
    }

}

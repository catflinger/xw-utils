import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpBackupSourceService } from './http-backup-source.service';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { BackupInfo } from './backup-info';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from '../app/auth.service';
import { v4 as uuid } from "uuid";
import { IPuzzleManager } from '../puzzles/puzzle-management.service';
import { AppSettingsService } from '../app/app-settings.service';
import { ApiSymbols } from '../common';

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
        private puzzleManager: IPuzzleManager,
        private settingsService: AppSettingsService,
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

    public get backups(): BackupInfo[] {
        return this._bsBackupList.value;
    }

    public backupSettings(origin: string, caption: string): Promise<void> {
        let result: Promise<any>;
        const creds = this.authService.getCredentials();

        if (creds.authenticated) {

            result = this.backupStore.addBackup(
                caption, 
                origin,
                "settings",
                "",
                "json", 
                JSON.stringify(this.settingsService.settings));
    
        } else {
            result = Promise.reject(ApiSymbols.AuthorizationFailure);
        }

        return result;
    }

    public backupPuzzle(id: string, origin: string, caption: string): Promise<void> {

        const creds = this.authService.getCredentials();

        if (creds.authenticated) {
            return this.localStorage.getPuzzle(id)
            .then(puzzle => {
                if (puzzle) {
                    return this.backupStore.addBackup(
                        caption, 
                        origin,
                        "puzzle",
                        puzzle.info.id,
                        "json", 
                        JSON.stringify(puzzle));
                } else {
                    throw "Could not find puzzle with id=" + id;
                }
            })
            .then(()=> this.refresh());
    
        } else {
            // TO DO ...
            console.log("NOT AUTHENTICATED!")
        }
        return Promise.resolve();
    }

    public restorePuzzle(backup: BackupInfo): Promise<void> {

        return this.backupStore.getBackup(backup.id)
        .then(backup => {
            let data: any = JSON.parse(backup.content);
            if (data.info.id) {
                data.info.id = uuid();
                let puzzle = new Puzzle(data);
                this.puzzleManager.addPuzzle(puzzle);
            } else {
                throw "not a backup of a puzzle!";
                //error! doesn't look like a puzzle to me
            }
        });
    }

    public deleteBackup(backup: BackupInfo): Promise<void> {
        return this.backupStore.deleteBackup(backup.id)
        .then(() => this.refresh());
    }

    public restoreSettings(backup: BackupInfo): Promise<void> {
        return this.backupStore.getBackup(backup.id)
        .then(backup => {
            if (backup.backupType === "settings") {
                let data: any = JSON.parse(backup.content);
                this.settingsService.update(data);
            } else {
                throw "Backup does not contain settings data";
            }
        });
    }

}

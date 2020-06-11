import { Injectable, Inject } from '@angular/core';
import { BehaviorSubject, Observable, combineLatest } from 'rxjs';
import { map } from "rxjs/operators";
import { HttpBackupSourceService } from './http-backup-source.service';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { BackupInfo } from './backup-info';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from '../app/auth.service';
import { v4 as uuid } from "uuid";
import { IPuzzleManager } from '../puzzles/puzzle-management.service';
import { AppSettingsService } from '../app/app-settings.service';
import { ApiSymbols, apiHosts } from '../common';
import { UpgradeToLatestVersion } from 'src/app/modifiers/puzzle-modifiers/UpgradeToLatestVersion';

// export type MergeAction = "skip" | "replace";

// export interface BackupOptions {
//     foo: boolean;
// }

// export interface RestoreOptions {
//     mergeAction: MergeAction; // what to do for conflicts
// }

const primary = 0;
const secondary = 1;
const development = 2;


@Injectable({
    providedIn: 'root'
})
export class BackupService {

    private _bsBackupLists: BehaviorSubject<BackupInfo[]>[] = [];

    constructor(
        private backupSource: HttpBackupSourceService,
        private localStorage: LocalStorageService,
        private puzzleManager: IPuzzleManager,
        private settingsService: AppSettingsService,
        private authService: AuthService,
    ) {
        this._bsBackupLists.push(new BehaviorSubject<BackupInfo[]>([]));
        this._bsBackupLists.push(new BehaviorSubject<BackupInfo[]>([]));
        this._bsBackupLists.push(new BehaviorSubject<BackupInfo[]>([]));

        this.refresh();
    }

    public refresh() {
        const creds = this.authService.getCredentials();

        if (creds.authenticated) {
            this.backupSource.getBackupList(apiHosts.primary, creds.username)
            .then(list => {
                this._bsBackupLists[primary].next(list);
            })
            .catch(() => console.log("Failed to get backups from Primary"));

            this.backupSource.getBackupList(apiHosts.secondary, creds.username)
            .then(list => {
                this._bsBackupLists[secondary].next(list);
            })
            .catch(() => console.log("Failed to get backups from Secondary"));

            this.backupSource.getBackupList(apiHosts.development, creds.username)
            .then(list => {
                this._bsBackupLists[development].next(list);
            })
            .catch(() => console.log("Failed to get backups from Development"));
        }
    }

    public observe(): Observable<BackupInfo[]> {
        return combineLatest([
            this._bsBackupLists[primary].asObservable(),
            this._bsBackupLists[secondary].asObservable(),
            this._bsBackupLists[development].asObservable(),
            ])
            .pipe(map((vals) => {
                const a = vals[primary];
                const b = vals[secondary];
                const c = vals[development];

                let result: BackupInfo[] = [];
                return result.concat(a).concat(b).concat(c);
            }));
    }

    // TO DO: rename this method?  Reads like we will go to the server to get the backup content
    
    public getBackup(id: string): BackupInfo {
        let result: BackupInfo = null;

        if (this._bsBackupLists[primary].value) {
            result = this._bsBackupLists[primary].value.find(b => b.id === id);
        }

        if (!result && this._bsBackupLists[secondary].value) {
            result = this._bsBackupLists[secondary].value.find(b => b.id === id);
        }
        
        if (!result && this._bsBackupLists[development].value) {
            result = this._bsBackupLists[development].value.find(b => b.id === id);
        }
        
        return result;
    }

    public backupSettings(origin: string, caption: string): Promise<void> {
        let result: Promise<any>;
        const creds = this.authService.getCredentials();

        if (creds.authenticated) {

            result = this.backupSource.addBackup(
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
                    return this.backupSource.addBackup(
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

        return this.backupSource.getBackup(backup.host, backup.id)
        .then(backup => {
            let data: any = JSON.parse(backup.content);
            if (data.info.id) {
                data.info.id = uuid();
                new UpgradeToLatestVersion().exec(data);

                this.puzzleManager.addPuzzle(new Puzzle(data));
            } else {
                throw "not a backup of a puzzle!";
                //error! doesn't look like a puzzle to me
            }
        });
    }

    public deleteBackup(backup: BackupInfo): Promise<void> {
        return this.backupSource.deleteBackup(backup.host, backup.id)
        .then(() => this.refresh());
    }

    public restoreSettings(backup: BackupInfo): Promise<void> {
        return this.backupSource.getBackup(backup.host, backup.id)
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

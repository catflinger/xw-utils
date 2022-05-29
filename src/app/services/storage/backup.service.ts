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
import { AppResultSymbols, apiHosts } from '../common';
import { UpgradeToLatestVersion } from 'src/app/modifiers/puzzle-modifiers/UpgradeToLatestVersion';
import { environment } from 'src/environments/environment';
import { AppService } from 'src/app/ui/general/app.service';

@Injectable({
    providedIn: 'root'
})
export class BackupService {

    private _bsBackupLists = {
        primary: new BehaviorSubject<BackupInfo[]>([]),
        //secondary: new BehaviorSubject<BackupInfo[]>([]),
        development: new BehaviorSubject<BackupInfo[]>([]),
    };

    constructor(
        private backupSource: HttpBackupSourceService,
        private localStorage: LocalStorageService,
        private puzzleManager: IPuzzleManager,
        private settingsService: AppSettingsService,
        private authService: AuthService,
        private appService: AppService,
    ) {
        this.refresh();
    }

    public refresh() {
        const creds = this.authService.getCredentials();

        if (creds.authenticated) {
            this.refreshBackupStore(creds.username, "primary");
            //this.refreshBackupStore(creds.username, "secondary");

            if (!environment.production) {
                this.refreshBackupStore(creds.username, "development");
            }
        }
    }

    public observe(): Observable<BackupInfo[]> {
        return combineLatest([
            this._bsBackupLists.primary.asObservable(),
            //this._bsBackupLists.secondary.asObservable(),
            this._bsBackupLists.development.asObservable(),
            ])
            .pipe(map((vals) => {
                const a = vals[0];
                const b = vals[1];
                //const c = vals[2];

                let result: BackupInfo[] = [];
                return result.concat(a).concat(b); //.concat(c);
            }));
    }

    // TO DO: rename this method?  Reads like we will go to the server to get the backup content
    
    public getBackup(id: string): BackupInfo {
        
        let result: BackupInfo = this.getBackupByHost("primary", id);

        //if(!result) {
        //    result = this.getBackupByHost("secondary", id);
        //}

        if(!result && !environment.production) {
            result = this.getBackupByHost("development", id);
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
            result = Promise.reject(AppResultSymbols.AuthorizationFailure);
        }

        return result;
    }

    public backupPuzzle(id: string, origin: string, caption: string): Promise<void> {
        let result: Promise<void>;

        const creds = this.authService.getCredentials();

        if (creds.authenticated) {
            result = this.localStorage.getPuzzle(id)
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
            result = Promise.reject("Authentication failed.  Please log in.");
        }
        
        return result;
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

    private refreshBackupStore(username: string, hostIndex: string): void {
        this.backupSource.getBackupList(apiHosts[hostIndex], username)
        .then(list => {
            this._bsBackupLists[hostIndex].next(list);
        })
        .catch(() => 
        {
            this.appService.setAlert("danger", "Failed to get backups from " + apiHosts[hostIndex]);
        });
    }

    private getBackupByHost(hostIndex: string, id: string): BackupInfo {
        let result: BackupInfo = null;
        
        if (this._bsBackupLists[hostIndex].value) {
            result = this._bsBackupLists[hostIndex].value.find(b => b.id === id);
        }
        return result;
    }
}

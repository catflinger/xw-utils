import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { HttpBackupSourceService } from './http-backup-source.service';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { BackupInfo } from './backup-info';
import { LocalStorageService } from './local-storage.service';
import { AuthService } from '../app/auth.service';
import { v4 as uuid } from "uuid";
import { IPuzzleManager } from '../puzzles/puzzle-management.service';

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

    public restorePuzzle(backup: BackupInfo): Promise<void> {
        // 0) check if logged in
        // 1) find the package info matching the id
        // 2) get the payload for this package from the backpStore
        // 3) apply the changes requested in the options

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

}

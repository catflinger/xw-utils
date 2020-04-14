import { Injectable } from '@angular/core';
import { IPuzzleManager } from '../puzzles/puzzle-management.service';
import { AppSettingsService } from '../app/app-settings.service';
import { BehaviorSubject, Observable } from 'rxjs';
import { PuzzleInfo } from '../../model/puzzle-info';
import { HttpBackupSourceService } from './http-backup-source.service';

export type MergeAction = "skip" | "replace";

export interface BackupOptions {
    foo: boolean;
}

export interface RestoreOptions {
    mergeAction: MergeAction; // what to do for conflicts
}

export class BackupPackageInfo {
    id: string;
    date: Date;
    hostname: string;
    notes: string;
    hasUserSettings: boolean;
    puzzles: PuzzleInfo[];
}

@Injectable({
    providedIn: 'root'
})
export class BackupService {

    private _bsBackupList = new BehaviorSubject<BackupPackageInfo[]>(null);

    constructor(
        private puzzleManager: IPuzzleManager,
        private appSettingsService: AppSettingsService,
        private backupStore: HttpBackupSourceService,
    ) { }

    public refresh() {
        // 1) get the backup info from the store
        // 2) push it into the behaviour subject
    }

    public observe(): Observable<BackupPackageInfo[]> {
        return this._bsBackupList.asObservable();
    }

    public makeBackup(options: BackupOptions): Promise<void> {
        // 0) check if logged in
        // 1) get the details of the local machine etc
        // 2) make a backup the user settings
        // 3) make a backup of the puzzles
        // 4) package this into a bundle
        // 5) send it somewhere
        // 6) refresh the backup list

        return Promise.resolve();
    }

    public restoreFromBackup(id: string, options: BackupOptions): Promise<void> {
        // 0) check if logged in
        // 1) find the package info matching the id
        // 2) get the payload for this package from the backpStore
        // 3) apply the changes requested in the options

        return Promise.resolve();
    }
}

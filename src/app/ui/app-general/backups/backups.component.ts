import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { BackupService } from 'src/app/services/storage/backup.service';
import { Subscription } from 'rxjs';
import { BackupInfo } from 'src/app/services/storage/backup-info';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';

@Component({
    selector: 'app-backups',
    templateUrl: './backups.component.html',
    styleUrls: ['./backups.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackupsComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public backups: BackupInfo[] = [];
    
    constructor(
        private backupService: BackupService,
        private navService: NavService<AppTrackData>,
        private detRef: ChangeDetectorRef,
    ) { }

    public ngOnInit(): void {
        this.subs.push(this.backupService.observe().subscribe(backups => {
            this.backups = backups;
            this.detRef.detectChanges();
        }));
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onRefresh() {
        this.backupService.refresh();
    }

    public onRestore(backup: BackupInfo) {
        this.backupService.restorePuzzle(backup)
        .then(() => {
            this.navService.beginTrack("solveTrack", {});
        });
    }
}

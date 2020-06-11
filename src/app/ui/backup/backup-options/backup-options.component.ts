import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { ActivatedRoute } from '@angular/router';
import { BackupService } from 'src/app/services/storage/backup.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { AppService } from '../../general/app.service';
import { Subscription, combineLatest } from 'rxjs';
import { BackupInfo } from 'src/app/services/storage/backup-info';
import { IPuzzleManager } from 'src/app/services/puzzles/puzzle-management.service';

@Component({
    selector: 'app-backup-options',
    templateUrl: './backup-options.component.html',
    styleUrls: ['./backup-options.component.css']
})
export class BackupOptionsComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    public backup: BackupInfo;

    constructor(
        private backupService: BackupService,
        private navService: NavService<AppTrackData>,
        private puzzleManager: IPuzzleManager,
        private detRef: ChangeDetectorRef,
        private authService: AuthService,
        private appService: AppService,
        private route: ActivatedRoute,
    ) { }

    public ngOnInit(): void {
        this.subs.push(
            this.route.paramMap.subscribe(paramMap => {
                const backupId = paramMap.get("id");
                this.backup = this.backupService.getBackup(backupId);
                this.detRef.detectChanges();
            })
        );
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }
    
    public onKeep() {
        this.backupService.restorePuzzle(this.backup)
        .then(() => {
            this.navService.beginTrack("solveTrack", {});
        });
    }

    public onReplace() {
        const puzzleId = this.backup.contentId;
        this.puzzleManager.deletePuzzle(puzzleId)
        .then(() => {
            return this.backupService.restorePuzzle(this.backup)
        })
        .then(() => {
            this.navService.beginTrack("solveTrack", {});
        })
        .catch((error) => {
            this.appService.setAlert("danger", "Failed to restore puzzle: " + error);
        });
    }

    public onCancel() {
        this.navService.goHome();
    }

}

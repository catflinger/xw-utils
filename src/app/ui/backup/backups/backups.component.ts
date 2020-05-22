import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { BackupService } from 'src/app/services/storage/backup.service';
import { Subscription } from 'rxjs';
import { BackupInfo } from 'src/app/services/storage/backup-info';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { AuthService, Credentials } from 'src/app/services/app/auth.service';
import { AppService } from '../../general/app.service';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';

@Component({
    selector: 'app-backups',
    templateUrl: './backups.component.html',
    styleUrls: ['./backups.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackupsComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public puzzleBackups: BackupInfo[] = [];
    public settingsBackups: BackupInfo[] = [];
    public creds: Credentials;
    
    constructor(
        private backupService: BackupService,
        private navService: NavService<AppTrackData>,
        private detRef: ChangeDetectorRef,
        private authService: AuthService,
        private appService: AppService,
    ) { }

    public ngOnInit(): void {

        //if not authenticated bail out
        if (!this.authService.getCredentials().authenticated) {
            this.appService.redirect = ["backups"];
            this.navService.gotoRoute(["login"]);
        }
        
        this.subs.push(this.authService.observe().subscribe(creds => {
            this.creds = creds;
            this.detRef.detectChanges();
        }));
        
        this.subs.push(this.backupService.observe().subscribe(backups => {
            this.puzzleBackups = backups.filter(b => b.backupType === "puzzle");
            this.settingsBackups = backups.filter(b => b.backupType === "settings");
            this.detRef.detectChanges();
        }));

        this.backupService.refresh();
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onRefresh() {
        this.backupService.refresh();
    }

    public onMakeBackup() {
        this.navService.gotoRoute(["backup"]);
    }

    public onRestoreSettings(backup: BackupInfo) {
        this.backupService.restoreSettings(backup)
        .then(() => {
            this.navService.goHome();
        });
}

    public onRestore(backup: BackupInfo) {

        if (this.localCopyExists(backup)) {
            this.navService.gotoRoute(["backup-options", backup.id]);
        } else {
            this.backupService.restorePuzzle(backup)
            .then(() => {
                this.navService.beginTrack("solveTrack", {});
            });
        }
    }

    public onDelete(backup: BackupInfo) {
        this.backupService.deleteBackup(backup);
    }

    private localCopyExists(backup: BackupInfo): boolean {
        let exists = true;

        return exists;
    }
}

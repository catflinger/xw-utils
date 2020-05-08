import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { BackupService } from 'src/app/services/storage/backup.service';
import { Subscription } from 'rxjs';
import { BackupInfo } from 'src/app/services/storage/backup-info';

@Component({
    selector: 'app-backup',
    templateUrl: './backup.component.html',
    styleUrls: ['./backup.component.css']
})
export class BackupComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public backups: BackupInfo[] = [];
    
    constructor(
        private backupService: BackupService,
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
}

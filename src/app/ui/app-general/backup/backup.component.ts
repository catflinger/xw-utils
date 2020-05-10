import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { BackupService } from 'src/app/services/storage/backup.service';
import { Subscription, combineLatest } from 'rxjs';
import { IPuzzleManager } from 'src/app/services/puzzles/puzzle-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { IPuzzleSummary } from 'src/app/model/interfaces';
import * as Bowser from "bowser";
import { AuthService } from 'src/app/services/app/auth.service';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';

@Component({
    selector: 'app-backup',
    templateUrl: './backup.component.html',
    styleUrls: ['./backup.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BackupComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];
    private puzzleId: string;

    public puzzles: IPuzzleSummary[] = [];
    public form: FormGroup;
    
    constructor(
        private backupService: BackupService,
        private puzzleManager: IPuzzleManager,
        private authService: AuthService,
        private navService: NavService<AppTrackData>,
        private detRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private router: Router,
    ) { }

    public ngOnInit(): void {

        if (!this.authService.getCredentials().authenticated) {
            this.navService.goHome();
        }

        const browser = Bowser.getParser(window.navigator.userAgent);

        this.form = this.formBuilder.group({
            puzzle: [null, Validators.required],
            caption: ["", Validators.required],
            browser: [browser.getBrowserName(), Validators.required],
            computer: ["", Validators.required],
        });

        this.subs.push(
            this.puzzleManager.getPuzzleList().subscribe(puzzles => {
                this.puzzles = puzzles;
                this.detRef.detectChanges();
            })
        );
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onBackup() {
        const origin = this.form.value.browser + " on " + this.form.value.computer;
        
        this.backupService.backupPuzzle(
            this.puzzleId, 
            origin, 
            this.form.value.caption)
        .then(() => this.router.navigate(["backups"]))
        .catch(() => console.log("failed"));
    }

    public onPuzzleChange() {
        //console.log("SELECT " + this.form.value.puzzle.info.title);
        this.form.patchValue({ caption: this.form.value.puzzle.info.title});
    }

    public onCancel() {
        this.navService.goHome();
    }
}

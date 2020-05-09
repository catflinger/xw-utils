import { Component, OnInit, OnDestroy, ChangeDetectorRef, ChangeDetectionStrategy } from '@angular/core';
import { BackupService } from 'src/app/services/storage/backup.service';
import { Subscription, combineLatest } from 'rxjs';
import { IPuzzleManager } from 'src/app/services/puzzles/puzzle-management.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { IPuzzleSummary } from 'src/app/model/interfaces';

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
        private detRef: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
    ) { }

    public ngOnInit(): void {

        this.form = this.formBuilder.group({
            caption: ["", Validators.required],
        });

        this.subs.push(
            combineLatest(this.puzzleManager.getPuzzleList(), this.route.paramMap)
            .subscribe(result => {
                this.puzzles = result[0];
                const paramMap = result[1];

                if (this.puzzles) {
                    this.puzzleId = paramMap.get("id");

                    const puzzle = this.puzzles.find(p => p.info.id === this.puzzleId);

                    if (puzzle) {
                        this.form.patchValue({
                            caption: puzzle.info.title, 
                        });
                    }
                }
                this.detRef.detectChanges();
            })
        );
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onBackup() {
        this.backupService.backupPuzzle(this.puzzleId)
        .then(() => this.router.navigate(["backups"]))
        .catch(() => console.log("failed"));
    }
}

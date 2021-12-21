import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';

@Component({
  selector: 'app-puzzle-dialog',
  templateUrl: './puzzle-dialog.component.html',
  styleUrls: ['./puzzle-dialog.component.css']
})
export class PuzzleDialogComponent implements OnInit {
    @Output() close = new EventEmitter<void>();

    public activeId: string = "PuzzleInfoFormComponent";
    
    public puzzle: Puzzle = null;

    private subs: Subscription[] = [];

    constructor(
        private activePuzzle: IActivePuzzle,
        private detRef: ChangeDetectorRef,
    ) { }

    public ngOnInit(): void {
        this.subs.push(
            this.activePuzzle.observe().subscribe(puzzle => {
                this.puzzle = puzzle;
                this.detRef.detectChanges();
            })
        );
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onClose() {
        //this.activePuzzle.commit();
        this.close.emit();
    }

}

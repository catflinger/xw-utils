import { Component, OnInit, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { NgbNavChangeEvent } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-puzzle-editor',
  templateUrl: './puzzle-editor.component.html',
  styleUrls: ['./puzzle-editor.component.css']
})
export class PuzzleEditorComponent implements OnInit {
    @Output() close = new EventEmitter<void>();

    public activeId: string = "PuzzleOptionsComponent";
    
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

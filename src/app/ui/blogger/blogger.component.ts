import { Component, OnInit, AfterViewInit, HostListener, OnDestroy } from '@angular/core';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { NgbModal, NgbModalRef } from '@ng-bootstrap/ng-bootstrap';
import { ClueEditorComponent } from '../clue-editor/clue-editor.component';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { Puzzle } from 'src/app/model/puzzle';
import { TextChunk } from 'src/app/model/clue-text-chunk';

@Component({
  selector: 'app-blogger',
  templateUrl: './blogger.component.html',
  styleUrls: ['./blogger.component.css']
})
export class BloggerComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    private subs: Subscription[] = [];

    constructor(
        private puzzleService: PuzzleService, 
        private router: Router) { }

    ngOnInit() {

        if (!this.puzzleService.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {
            this.subs.push(
                this.puzzleService.getObservable().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;
                    }
            ));
        }
    }

    ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.router.navigate(["/publish-options"]);
    }

    onBack() {
        this.router.navigate(["/home"]);
    }

    onRowClick(clue: Clue) {
        this.puzzleService.selectClue(clue.id);
    }

    onEditorClose(clue: Clue, reason: string) {
        if (reason === "cancel") {
            this.puzzleService.clearSelection();
        } else {
            this.puzzleService.selectNextClue(clue.id);
        }
    }

    makeChunkStyle(chunk: TextChunk): any {
        let result: any = {};

        result.color = "blue";
        if (chunk.isDefinition) {
            result["text-decoration"] = "underline";
        }
        return result;
    }
}

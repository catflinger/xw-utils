import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ClueUpdate } from 'src/app/services/clue-update';
import { PuzzleService } from 'src/app/services/puzzle.service';

@Component({
    selector: 'app-clue-editor',
    templateUrl: './clue-editor.component.html',
    styleUrls: ['./clue-editor.component.css']
})
export class ClueEditorComponent implements OnInit {
    @Input() clueId: string;
    @Input() starterText: string;
    @Input() latestAnswer: string;

    public model: ClueUpdate;

    constructor(
        private puzzleService: PuzzleService, 
        public activeModal: NgbActiveModal) { }

    ngOnInit() {

        let puzzle = this.puzzleService.getObservable().subscribe(
            (puzzle) => {
                if (puzzle) {
                    let clue = puzzle.clues.find((c) => c.id === this.clueId);
                    this.model = new ClueUpdate(clue);
                    this.model.answer = this.starterText ? this.starterText : clue.answer;
                }
            }
        );
    }

    public close() {
        this.puzzleService.updateClue(this.clueId, this.model);
        this.activeModal.close();
    }

    public cancel() {
        this.activeModal.close();
    }

    public showLatestAnswer(): boolean {
        return this.latestAnswer && /_+/.test(this.latestAnswer);
    }
}

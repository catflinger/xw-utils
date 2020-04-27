import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { ClueEditorService } from '../../clue-editor.service';
import { Clue } from 'src/app/model/clue';
import { IClueEditorForm } from '../../clue-editor/clue-editor.component';

@Component({
    selector: 'app-add-remove-clue',
    templateUrl: './add-remove-clue.component.html',
    styleUrls: ['./add-remove-clue.component.css']
})
export class AddRemoveClueComponent implements OnInit, OnDestroy, IClueEditorForm {
    private subs: Subscription[] = [];
    private instanceId: string = null;
    
    public  clue: Clue;
    public letters: string[];

    @Output() dirty = new EventEmitter<void>();

    constructor(
        private activePuzzle: IActivePuzzle,
        private editorService: ClueEditorService,
    ) { }

    public ngOnInit() {

        this.instanceId = this.editorService.register(() => Promise.resolve(false));

        this.subs.push(
            this.activePuzzle.observe().subscribe(
                (puzzle) => {
                    if (puzzle) {
                        this.clue = puzzle.getSelectedClue();
                        if (this.clue) {
                            this.letters = Array.from(this.clue.text)
                        } else {
                            this.letters = [];
                        }
                    }
                }
            )
        );
    }

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
        this.editorService.unRegister(this.instanceId);
    }

    public onLetterClick(index: number) {
        console.log("You clicked " + index)
    }
}

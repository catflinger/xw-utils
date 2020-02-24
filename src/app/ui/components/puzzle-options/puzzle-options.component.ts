import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { UpdatePublsihOptions } from 'src/app/services/modifiers/update-publish-options';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-puzzle-options',
    templateUrl: './puzzle-options.component.html',
    styleUrls: ['./puzzle-options.component.css']
})
export class PuzzleOptionsComponent implements OnInit, OnDestroy {
    public showOptions = false;
    public modifyAnswers;

    @Output() public edit = new EventEmitter<void>();

    private subs: Subscription[] = [];

    constructor(private activePuzzle: IActivePuzzle) { }

    public ngOnInit() {
        //this.subs.push(this.activePuzzle.observe().subscribe(puzzle => this.modifyAnswers = puzzle.publishOptions.modifyAnswers));
    }

    public  ngOnDestroy() {
        this.subs.forEach(s => s .unsubscribe());
    }

    public onPuzzleOptions() {
        this.showOptions = !this.showOptions;
    }

    public onEdit() {
        this.edit.emit();
    }

    public onAnswerModificationChange(){
        //this.activePuzzle.update(new UpdatePublsihOptions({modifyAnswers: this.modifyAnswers}))
    }
}

import { Component, OnInit, Input, ChangeDetectionStrategy, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { TextStyle } from 'src/app/model/puzzle-model/text-style';
import { TextChunk } from 'src/app/model/puzzle-model/clue-text-chunk';
import { PublishOptions } from 'src/app/model/puzzle-model/publish-options';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-clue-text',
    templateUrl: './clue-text.component.html',
    styleUrls: ['./clue-text.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClueTextComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    @Input() clueId: string;
    
    public publishOptions: PublishOptions;
    public clue: Clue;

    constructor(
        private activePuzzle: IActivePuzzle,
        private detRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {
        this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
            if (puzzle) {
                this.clue = puzzle.clues.find(c => c.id === this.clueId);
                this.publishOptions = puzzle.publishOptions;
            }
            this.detRef.detectChanges();
        }));
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    makeChunkStyle(chunk: TextChunk): any {
        let result: any = {};

        let textStyle: TextStyle = chunk.isDefinition ? 
        this.publishOptions.definitionStyle :
        this.publishOptions.clueStyle;

        result.color = textStyle.color;

        result["text-decoration"] = textStyle.underline ?  "underline": "none";
        result["font-weight"] = textStyle.bold ?  "bold": "normal";
        result["font-style"] = textStyle.italic ?  "italic": "normal";

        return result;
    }
}

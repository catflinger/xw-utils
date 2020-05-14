import { Component, OnInit, Input, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { TextStyle } from 'src/app/model/puzzle-model/text-style';
import { PublishOptions } from 'src/app/model/puzzle-model/publish-options';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Subscription } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';

export interface CluesPreviewOptions {
    count?: number;
} 

@Component({
  selector: 'app-clues-preview',
  templateUrl: './clues-preview.component.html',
  styleUrls: ['./clues-preview.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CluesPreviewComponent implements OnInit, OnDestroy {
    private subs: Subscription[] = [];

    public answerStyle: any = {};
    public clueStyle: any = {};
    public definitionStyle: any = {};

    public clues: Clue[];
    public publishOptions: PublishOptions;

    @Input() public options: CluesPreviewOptions;

    constructor(
        private activePuzzle: IActivePuzzle,
        private detRef: ChangeDetectorRef,
        ) { }

    ngOnInit() {
        this.activePuzzle.observe().subscribe(puzzle => {
            if (puzzle) {
                this.clues = puzzle.clues.filter((c, index) => index < this.rowCount);
                this.publishOptions = puzzle.publishOptions;
            } else {
                this.clues = null;
                this.publishOptions = null;
            }
            this.detRef.detectChanges();
        });
    }

    ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public get includeGrid(): boolean {
        return this.publishOptions && this.publishOptions.includeGrid;
    }

    public get rowCount(): number {
        let count = 3;
        if (this.options && typeof this.options.count === "number") {
            count = Math.floor(this.options.count);
        }
        return count;
    }

    public makeAnswerStyle(): any {
        if (this.publishOptions) {
            return this.makeStyle(this.publishOptions.answerStyle);
        }
        return {};
    }

    public makeClueStyle(): any {
        if (this.publishOptions) {
            return this.makeStyle(this.publishOptions.clueStyle);
        }
        return {};
    }

    public get tdClass(): string[] {
        let result: string[] = [];

        switch (this.publishOptions.spacing) {
            case "small":
                result.push("py-0");
                result.push("px-1");
                break;
            case "medium":
                result.push("pt-1");
                result.push("px-2");
                break;
            case "large":
                result.push("pt-2");
                result.push("px-2");
                break;
            default:
                result.push("py-1");
                break;
        }
        return result;
    }

    private makeStyle(textStyle: TextStyle): any {
        return {
            "color": textStyle.color,
            "font-weight": textStyle.bold ? "bold" : "normal",
            "font-style": textStyle.italic ? "italic" : "normal",
            "text-decoration": textStyle.underline ? "underline" : "unset",
        }
    }

}

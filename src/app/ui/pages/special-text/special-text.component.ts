import { v4 as uuid } from "uuid";
import { Component, OnInit, OnDestroy } from '@angular/core';
import { AppService } from '../../services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextParsingService } from 'src/app/services/parsing/text/text-parsing-service';
import { ParseData } from 'src/app/services/parsing/text/parse-data';
import { IParseContext } from 'src/app/services/parsing/text/text-parsing-context';
import { Puzzle } from 'src/app/model/puzzle';
import { QuillDelta } from 'src/app/model/interfaces';
import { IPuzzleManager, IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { NavService } from '../../navigation/nav.service';
import { AppTrackData } from '../../navigation/tracks/app-track-data';
import { Subscription } from 'rxjs';
import { AddClues } from 'src/app/services/modifiers/add-clues';

const defaultText: string = "ACROSS\n1 This is an across clue (5)\nDOWN\n2 This is a down clue (7)";

@Component({
    selector: 'app-special-text',
    templateUrl: './special-text.component.html',
    styleUrls: ['./special-text.component.css']
})
export class SpecialTextComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    private subs: Subscription[] = [];
    public form: FormGroup;
    public parseResult: IParseContext = null;

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private textParsingService: TextParsingService,
        private puzzleManager: IPuzzleManager,
        private fb: FormBuilder,
    ) { }

    public ngOnInit() {
        this.form = this.fb.group({
            title: ["", Validators.required],
            text: [defaultText, Validators.required],
        });

        this.subs.push(
            this.activePuzzle.observe().subscribe(
                (puzzle) => {
                    this.puzzle = puzzle;
                    if (puzzle) {
                        this.form.patchValue({ 
                            title: puzzle.info.title,
                            text: puzzle.info.source
                        });
                    }
                }
        ));

    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onParse() {
        this.appService.clear();
        try {
            this.parseResult = this.parse(this.form.value.text);

            if (!this.parseResult.error) {
                //patch puzzle
                this.activePuzzle.update(new AddClues({ clues: this.parseResult.clues }));

                this.navService.navigate("blog");
            } else {
                this.appService.setAlert("danger", "Parsing Error :" + this.parseResult.error.message);
            }
        } catch(error) {
            this.appService.setAlert("danger", "ERROR :" + error.message)
        }
    }

    public onCancel() {
        this.navService.goHome();
    }

    public onAmend() {
        this.parseResult = null;
    }

    public onKeyDown(event: KeyboardEvent) {
        // to stop errors from LastPass and other browser add-ons that attach listeners to this control
        event.stopPropagation();
    }

    private parse(text: string): IParseContext {
        let parseData = new ParseData();
        parseData.clueDataType = "text";
        parseData.rawData = text;

        let parser = this.textParsingService.parser(parseData, null);
        let context = parser.next();

        while(!context.done) {
            context = parser.next();
        }
    
        return context.value as IParseContext;
    }

}

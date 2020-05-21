import { Component, OnInit, OnDestroy, Provider } from '@angular/core';
import { AppService } from '../../services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { IActivePuzzle, IPuzzleManager } from 'src/app/services/puzzles/puzzle-management.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { Subscription } from 'rxjs';
import { UpdateInfo } from 'src/app//modifiers/puzzle-modifiers/update-info';
import { ITextParsingError } from 'src/app/model/interfaces';

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
    public parseError: ITextParsingError = null;

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private puzzleManager: IPuzzleManager,
        private fb: FormBuilder,
    ) { }

    public ngOnInit() {

        this.form = this.fb.group({
            //title: ["", Validators.required],
            text: [defaultText, Validators.required],
        });

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {

            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;
                        if (puzzle) {
                            this.form.patchValue({ 
                                //title: puzzle.info.title,
                                text: puzzle.provision.source,
                            });

                            const errors = puzzle.provision.parseErrors;
                            this.parseError = errors && errors.length > 0 ? errors[0] : null;
                        }
                    }
            ));
        }
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onParse() {
        this.appService.clear();

        const params = new UpdateInfo({
            //title: this.form.value.title,
            source: this.form.value.text 
        });

        if (this.puzzle) {
            this.activePuzzle.updateAndCommit(params);
        } else {
            this.puzzleManager.newPuzzle("local", [params]);
        }

        this.navService.navigate("parse");
    }

    public onCancel() {
        this.navService.navigate("cancel");
    }

    public onAmend() {
        this.parseError = null;
    }

    // private parse(text: string): IParseContext {
    //     let parseData = new ParseData();
    //     parseData.clueDataType = "text";
    //     parseData.rawData = text;

    //     let parser = this.textParsingService.parser(parseData, null);
    //     let context = parser.next();

    //     while(!context.done) {
    //         context = parser.next();
    //     }
    
    //     return context.value as IParseContext;
    // }

}

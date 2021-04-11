import { Component, OnInit, OnDestroy, Provider, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { AppService } from '../../general/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { IActivePuzzle, IPuzzleManager } from 'src/app/services/puzzles/puzzle-management.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { Subscription } from 'rxjs';
import { UpdateInfo } from 'src/app//modifiers/puzzle-modifiers/update-info';
import { ITextParsingError } from 'src/app/model/interfaces';
import { UpdateProvision } from 'src/app/modifiers/puzzle-modifiers/update-provision';

const defaultText: string = "ACROSS\n1 This is an across clue (5)\nDOWN\n2 This is a down clue (7)";

@Component({
    selector: 'app-special-text',
    templateUrl: './special-text.component.html',
    styleUrls: ['./special-text.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
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
        private changeRef: ChangeDetectorRef,
    ) { }

    public ngOnInit() {

        this.form = this.fb.group({
            text: [defaultText, Validators.required],
            provisionOptions: null,
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
                                text: puzzle.provision.source,
                                provisionOptions:puzzle.provision,
                            });

                            const errors = puzzle.provision.parseErrors;
                            this.parseError = errors && errors.length > 0 ? errors[0] : null;
                        } else {
                            this.parseError = null;
                        }

                        this.changeRef.detectChanges();
                    }
            ));
        }
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onParse() {
        this.appService.clear();

        const params = [
            new UpdateInfo({source: this.form.value.text}),
            new UpdateProvision(this.form.value.provisionOptions),
        ];

        if (this.puzzle) {
            this.activePuzzle.updateAndCommit(...params);
        } else {
            this.puzzleManager.newPuzzle("local", params);
        }

        this.navService.navigate("parse");
    }

    public onCancel() {
        this.appService.clear();
        this.navService.navigate("cancel");
    }

    public onAmend() {
        this.appService.clear();
        this.parseError = null;
        this.changeRef.detectChanges();
    }
}

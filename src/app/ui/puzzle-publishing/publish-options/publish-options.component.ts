import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Subscription } from 'rxjs';
import { AppService, AppStatus } from 'src/app/ui/general/app.service';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { UpdatePublsihOptions } from 'src/app//modifiers/publish-options-modifiers/update-publish-options';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { UpdatePublsihOptionTextStyle } from 'src/app/modifiers/publish-options-modifiers/update-publish-option-text-style';
import { PublishOptions } from 'src/app/model/puzzle-model/publish-options';
import { FormBuilder, FormGroup } from '@angular/forms';
import { fifteensquaredAnswerStyle, fifteensquaredClueStyle, fifteensquaredDefinitionStyle } from 'src/app/model/puzzle-model/text-style';

@Component({
    selector: 'app-publish-options',
    templateUrl: './publish-options.component.html',
    styleUrls: ['./publish-options.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PublishOptionsComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public appStatus: AppStatus;
    public form: FormGroup;
    
    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private fb: FormBuilder,
        private detRef: ChangeDetectorRef,
    ) { }

    ngOnInit() {

        this.form = this.fb.group({
            includeGrid: null, 
            layout: null, 
            spacing: null,
            useThemeDefaults: null,
            showClueGroups: null,
            showClueCaptions: null,
            answerStyle: null,
            clueStyle: null,
            definitionStyle: null,
        });

        this.subs.push(this.appService.getObservable().subscribe(appStatus => {
            this.appStatus = appStatus;
            this.detRef.detectChanges();
        }));

        this.subs.push(this.form.valueChanges.subscribe(values =>
            this.saveAndCommit(values)
        ));

        this.subs.push(this.form.get("useThemeDefaults").valueChanges.subscribe(useThemeDefaults => {
            if (useThemeDefaults) {
                this.form.patchValue({
                    answerStyle: fifteensquaredAnswerStyle,
                    clueStyle: fifteensquaredClueStyle,
                    definitionStyle: fifteensquaredDefinitionStyle,
                });
            }
        }));

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {

            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;

                        if (puzzle) {

                            this.form.patchValue(
                            {
                                includeGrid: puzzle.publishOptions.includeGrid, 
                                layout: puzzle.publishOptions.layout, 
                                spacing: puzzle.publishOptions.spacing,
                                showClueGroups: puzzle.publishOptions.showClueGroups,
                                showClueCaptions: puzzle.publishOptions.showClueCaptions,
                                answerStyle: puzzle.publishOptions.answerStyle,
                                clueStyle: puzzle.publishOptions.clueStyle,
                                definitionStyle: puzzle.publishOptions.definitionStyle,
                                useThemeDefaults: puzzle.publishOptions.useThemeDefaults,
                            },
                            { 
                                emitEvent: false
                            }
                            );
                        }

                        this.detRef.detectChanges();
                    }
                )
            );
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onContinue() {
        this.navService.navigate("continue");
    }

    public onBack() {
        this.navService.navigate("back");
    }

    public onGrid() {
        this.navService.navigate("grid");
    }

    public onNina() {
        this.navService.navigate("nina");
    }

    private saveAndCommit(values: PublishOptions) {

        this.activePuzzle.updateAndCommit(
            new UpdatePublsihOptions(values),
            new UpdatePublsihOptionTextStyle(
                "answer",
                values.answerStyle.color,
                values.answerStyle.bold,
                values.answerStyle.italic,
                values.answerStyle.underline,
            ),
            new UpdatePublsihOptionTextStyle(
                "definition",
                values.definitionStyle.color,
                values.definitionStyle.bold,
                values.definitionStyle.italic,
                values.definitionStyle.underline,
            ),
            new UpdatePublsihOptionTextStyle(
                "clue",
                values.clueStyle.color,
                values.clueStyle.bold,
                values.clueStyle.italic,
                values.clueStyle.underline,
            ),
        );
    }
}

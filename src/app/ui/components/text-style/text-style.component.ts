import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Subscription, combineLatest } from 'rxjs';
import { AppService, AppStatus } from 'src/app/ui/services/app.service';
import { Puzzle } from 'src/app/model/puzzle';
import { UpdatePublsihOptionTextStyle } from 'src/app/services/modifiers/update-publish-option-text-style';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { TextStyleName } from 'src/app/model/interfaces';

@Component({
    selector: 'app-text-style',
    templateUrl: './text-style.component.html',
    styleUrls: ['./text-style.component.css']
})
export class TextStyleComponent implements OnInit, OnDestroy {
    public form: FormGroup;
    public appStatus: AppStatus;
    public puzzle: Puzzle;

    private subs: Subscription[] = [];

    @Input() textStyleName: TextStyleName;
    @Input() caption: string;

    constructor(
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private formBuilder: FormBuilder
        ) { }

    ngOnInit() {

        this.form = this.formBuilder.group({
            color: null,
            bold: false,
            italic: false,
            underline: false
        });

        this.subs.push(this.form.valueChanges.subscribe((val) => {
            if (this.puzzle && this.appStatus) {

                this.activePuzzle.update(new UpdatePublsihOptionTextStyle(
                    this.textStyleName,
                    val.color,
                    val.bold,
                    val.italic,
                    val.underline));
            }
        }));

        let latest = combineLatest(this.appService.getObservable(), this.activePuzzle.observe());

        this.subs.push(latest.subscribe((result) => {
            this.appStatus = result[0];
            this.puzzle = result[1];

            if (this.puzzle && this.appStatus) {
                if(this.appStatus.busy) {
                    this.form.disable({emitEvent: false});
                } else {
                    this.form.enable({emitEvent: false});
                }

                let ts = this.puzzle.publishOptions[this.textStyleName];

                this.form.controls["bold"].patchValue(ts.bold, { emitEvent: false});
                this.form.controls["italic"].patchValue(ts.italic, { emitEvent: false});
                this.form.controls["underline"].patchValue(ts.underline, { emitEvent: false});
                this.form.controls["color"].patchValue(ts.color, { emitEvent: false});
            }
        }));

    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }
}

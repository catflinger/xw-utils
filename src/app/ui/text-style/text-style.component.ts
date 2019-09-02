import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TextStyleName } from '../common';
import { PuzzleService } from 'src/app/services/puzzle.service';
import { Subscription, combineLatest } from 'rxjs';
import { AppService, AppStatus } from 'src/app/services/app.service';
import { Puzzle } from 'src/app/model/puzzle';
import { TextStyle } from 'src/app/model/text-style';

class ColorPickerOption {
    public name: string;
    public value: string;
}

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
        private puzzleService: PuzzleService,
        private formBuilder: FormBuilder
        ) { }

    ngOnInit() {

        this.form = this.formBuilder.group({
            color: this.options[0],
            bold: false,
            italic: false,
            underline: false
        });

        this.subs.push(this.form.valueChanges.subscribe((val) => {
            if (this.puzzle && this.appStatus) {

                this.puzzleService.updatePublishOptionTextStyle(
                    this.textStyleName,
                    val.color.value, 
                    val.bold, 
                    val.italic, 
                    val.underline);
            }
        }));

        let latest = combineLatest(this.appService.getObservable(), this.puzzleService.getObservable());

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

                let option = this.options.find(o => o.value === ts.color);

                this.form.controls["bold"].patchValue(ts.bold, { emitEvent: false});
                this.form.controls["italic"].patchValue(ts.italic, { emitEvent: false});
                this.form.controls["underline"].patchValue(ts.underline, { emitEvent: false});
                this.form.controls["color"].patchValue(option, { emitEvent: false});
            }
        }));

    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public options: ColorPickerOption[] = [
        { name: "green", value: "green" },
        { name: "black", value: "black" },
        { name: "red", value: "red" },
        { name: "blue", value: "blue" }
    ];
}

import { Component, forwardRef, OnInit, SimpleChange } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CaptionStyle, ClueGroup } from 'src/app/model/interfaces';
import { ClueValidators } from '../clue-validators';

export interface ClueEditValue {
    text: string,
    caption: string,
    group: ClueGroup,
    options: {
        captionStyle: CaptionStyle,
        hasLetterCount: boolean,
        hasClueGroupHeadings: boolean,
    }
}

@Component({
    selector: 'app-clue-editor-control',
    templateUrl: './clue-editor-control.component.html',
    styleUrls: ['./clue-editor-control.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ClueEditorControlComponent),
            multi: true
        },
    ]
})
export class ClueEditorControlComponent implements ControlValueAccessor, OnInit {
    private onChange: any = () => { };
    private onTouched: any = () => { };
    private subs: Subscription[] = [];

    public form: FormGroup;
    public showAdvancedOptions = false;

    constructor(
        private fb: FormBuilder,
    ) { }


    public ngOnInit(): void {
        this.form = this.fb.group({
            text: "",
            caption: "",
            group: "across",
            
            options: {
                captionStyle: "numbered",
                hasLetterCount: true,
                hasClueGroupHeadings: true,
            }
        });

        this.setValidators();

        this.subs.push(
            this.form.get("options").valueChanges.subscribe(_ => {
                this.setValidators();
            })
        );

        this.subs.push(
            this.form.valueChanges.subscribe((change) => {
                this.onChange(change);
            })
        );

    }

    public writeValue(value: ClueEditValue): void {
        this.form.patchValue(value, { emitEvent: false });
    }

    public registerOnChange(fn: any): void {
        this.onChange = fn;
    }

    public registerOnTouched(fn: any): void {
        this.onTouched = fn;
    }

    public setDisabledState?(isDisabled: boolean): void {
        // throw new Error('Method not implemented.');
    }

    private setValidators() {
        this.form.get("caption").setValidators(
            ClueValidators.getCaptionValidators(this.form.get("options").value.captionStyle)
        );
        this.form.get("caption").updateValueAndValidity();

        this.form.get("text").setValidators(
            ClueValidators.getTextValidators(this.form.get("options").value.hasLetterCount)
        );
        this.form.get("text").updateValueAndValidity();
    }
}

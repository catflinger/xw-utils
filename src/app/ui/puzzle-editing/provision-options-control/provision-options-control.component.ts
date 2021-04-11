import { Component, forwardRef, OnInit } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { CaptionStyle } from 'src/app/model/interfaces';

export interface ProvisionOptions {
    captionStyle: CaptionStyle,
    hasLetterCount: boolean,
    hasClueGroupHeadings: boolean,
}

const defaultProvisionOptions: ProvisionOptions = {
    captionStyle: "numbered",
    hasLetterCount: true,
    hasClueGroupHeadings: true,
}

@Component({
    selector: 'app-provision-options-control',
    templateUrl: './provision-options-control.component.html',
    styleUrls: ['./provision-options-control.component.css'],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => ProvisionOptionsControlComponent),
            multi: true
        },
    ]
})
export class ProvisionOptionsControlComponent implements ControlValueAccessor, OnInit {
    private onChange: any = () => { };
    private onTouched: any = () => { };
    private subs: Subscription[] = [];

    public form: FormGroup;

    constructor(
        private fb: FormBuilder,
    ) { }


    public ngOnInit(): void {
        this.form = this.fb.group({
            captionStyle: [defaultProvisionOptions.captionStyle, Validators.required],
            hasLetterCount: defaultProvisionOptions.hasLetterCount,
            hasClueGroupHeadings: defaultProvisionOptions.hasClueGroupHeadings,
        });

        this.subs.push(
            this.form.valueChanges.subscribe(value => {
                this.onChange(value);
                this.onTouched();
            })
        );
    }

    public writeValue(options: ProvisionOptions): void {
        if (options) {
            this.form.patchValue(options, { emitEvent: false });
        } else {
            this.form.patchValue(defaultProvisionOptions, { emitEvent: false});
        }
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
}

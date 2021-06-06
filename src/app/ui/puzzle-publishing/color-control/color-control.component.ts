import { Component, OnInit, forwardRef, Input, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cssNamedColors } from "./colors";

class ColorPickerOption {
    public caption: string;
    public value: string;
}

@Component({
    selector: 'app-color-control',
    templateUrl: './color-control.component.html',
    styleUrls: ['./color-control.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ColorControlComponent),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ColorControlComponent implements ControlValueAccessor, OnInit {
    private propagateChange = (_: any) => { };
    public options: ColorPickerOption[];
    public form: FormGroup;

    constructor(
        private fb: FormBuilder,
        private detRef: ChangeDetectorRef
    ) {
        this.options = cssNamedColors;
    }

    public ngOnInit() {

        this.form = this.fb.group({
            colorValue: ""
        });

        this.form.valueChanges.subscribe(values => this.propagateChange(values.colorValue));
    }

    public writeValue(color: string) {

        this.form.patchValue({ colorValue: color }, { emitEvent: false });
        this.detRef.detectChanges();
    }

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {
    }

}

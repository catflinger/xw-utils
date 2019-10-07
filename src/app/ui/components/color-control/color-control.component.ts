import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { cssNamedColors } from "./colors";

class ColorPickerOption {
    public caption: string;
    public value: string;
}

@Component({
    selector: 'app-color-control',
    templateUrl: './color-control.component.html',
    styleUrls: ['./color-control.component.css'],
    providers: [    { 
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => ColorControlComponent),
        multi: true
    }],
})
export class ColorControlComponent implements ControlValueAccessor, OnInit {
    public color: ColorPickerOption;
    private propagateChange = (_: any) => { };
    public options: ColorPickerOption[];

    constructor() {
        this.options = cssNamedColors;
    }

    public ngOnInit() {
        this.color = this.options[0];
    }

    public writeValue(color: string) {
        let option = color ? 
            this.options.find(opt => opt.value === color.toLowerCase().replace(";", "")) :
            null;

        if (option) {
            this.color = option;
        } else {
            this.color = this.options[0];
        }
    }

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {
    }

    public onColorChange() {
        this.propagateChange(this.color.value);
    }
}

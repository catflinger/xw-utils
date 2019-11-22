import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-diary-alias-control',
  templateUrl: './diary-alias-control.component.html',
  styleUrls: ['./diary-alias-control.component.css'],
  providers: [    { 
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => DiaryAliasControlComponent),
    multi: true
}],
})
export class DiaryAliasControlComponent implements ControlValueAccessor, OnInit {

    @Input() public text: string;
    @Output() public remove = new EventEmitter<string>();

    private propagateChange = (_: any) => { };

    constructor() { }

    public ngOnInit() {
    }

    public writeValue(text: string) {
        this.text = text;
    }

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {
    }

    public onXClick() {
        this.remove.emit(this.text);
    }
}
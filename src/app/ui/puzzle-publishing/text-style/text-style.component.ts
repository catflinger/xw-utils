import { Component, OnInit, Input, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef, Output, EventEmitter, forwardRef } from '@angular/core';
import { ControlValueAccessor, FormBuilder, FormGroup, NG_VALUE_ACCESSOR } from '@angular/forms';
import { Subscription } from 'rxjs';
import { TextStyleName } from 'src/app/model/interfaces';
import { TextStyle } from 'src/app/model/puzzle-model/text-style';

@Component({
    selector: 'app-text-style',
    templateUrl: './text-style.component.html',
    styleUrls: ['./text-style.component.css'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TextStyleComponent),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TextStyleComponent implements OnInit, OnDestroy, ControlValueAccessor {
    public form: FormGroup;
    private propagateChange = (_: any) => { };

    private subs: Subscription[] = [];

    @Input() textStyleName: TextStyleName;
    @Input() caption: string;
    @Output() change = new EventEmitter<void>();

    constructor(
        private formBuilder: FormBuilder,
        private detRef: ChangeDetectorRef,
        ) { }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            name: "",
            color: null,
            bold: false,
            italic: false,
            underline: false,
            class: null
        });

        this.subs.push(this.form.valueChanges.subscribe((val) => {
            this.propagateChange(val);
        }));
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public writeValue(textStyle: TextStyle) {

        this.form.patchValue(textStyle, { emitEvent: false });
        this.detRef.detectChanges();
    }

    public registerOnChange(fn) {
        this.propagateChange = fn;
    }

    public registerOnTouched() {
    }

}

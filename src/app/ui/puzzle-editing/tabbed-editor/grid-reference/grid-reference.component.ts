import { Component, OnInit, Input, Output, EventEmitter, forwardRef, Type, ChangeDetectionStrategy } from '@angular/core';
import { GridReference } from 'src/app/model/puzzle-model/grid-reference';
import { Direction } from 'src/app/model/interfaces';
import { FormBuilder, FormGroup } from '@angular/forms';

export interface GridReferenceEvent {
    id: string,
    label: number,
    direction: Direction,
}

@Component({
    selector: 'app-grid-reference',
    templateUrl: './grid-reference.component.html',
    styleUrls: ['./grid-reference.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridReferenceComponent implements OnInit {

    @Input() public gridRef: GridReference;
    @Input() public editable: boolean;

    @Output() public remove = new EventEmitter<GridReferenceEvent>();
    @Output() public save = new EventEmitter<GridReferenceEvent>();

    public form: FormGroup;

    constructor(
        private fb: FormBuilder
    ) { }

    public ngOnInit() {
        this.form = this.fb.group({
            caption: this.gridRef.label,
            direction: this.gridRef.direction,
        });
    }

    public onRemove() {
        this.remove.emit({ 
            id: this.gridRef.id,
            label: null,
            direction: null,
        });
    }

    public onSave() {
        this.save.emit({ 
            id: this.gridRef.id,
            label: this.form.value.caption,
            direction: this.form.value.direction,
        });
    }

}
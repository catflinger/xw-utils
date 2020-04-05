import { Component, OnInit, Input, Output, EventEmitter, forwardRef, Type } from '@angular/core';
import { GridReference } from 'src/app/model/grid-reference';
import { Direction } from 'src/app/model/interfaces';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ClueEditorService } from '../clue-editor.service';

export interface GridReferenceEvent {
    id: string,
    caption: number,
    direction: Direction,
}

@Component({
    selector: 'app-grid-reference',
    templateUrl: './grid-reference.component.html',
    styleUrls: ['./grid-reference.component.css']
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
            caption: this.gridRef.caption,
            direction: this.gridRef.direction,
        });
    }

    public onRemove() {
        this.remove.emit({ 
            id: this.gridRef.id,
            caption: null,
            direction: null,
        });
    }

    public onSave() {
        this.save.emit({ 
            id: this.gridRef.id,
            caption: this.form.value.caption,
            direction: this.form.value.direction,
        });
    }

}
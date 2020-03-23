import { Component, OnInit, Input, Output, EventEmitter, forwardRef } from '@angular/core';

export interface DiaryAliasEvent {
    id: number,
    text: string,
}

@Component({
  selector: 'app-diary-alias-control',
  templateUrl: './diary-alias-control.component.html',
  styleUrls: ['./diary-alias-control.component.css'],
})
export class DiaryAliasControlComponent implements OnInit {

    @Input() public text: string;
    @Input() public id: number;
    @Input() public editable: boolean;

    @Output() public remove = new EventEmitter<DiaryAliasEvent>();
    @Output() public save = new EventEmitter<DiaryAliasEvent>();

    constructor() { }

    public ngOnInit() {
    }

    public onRemove() {
        this.remove.emit({ 
            id: this.id,
            text: this.text,
        });
    }

    public onSave() {
        this.save.emit({ 
            id: this.id,
            text: this.text,
        });
    }
}
import { Injectable } from '@angular/core';
import { GridEditor } from './grid-editors/grid-editor';
import { GridEditors } from '../common';
import { Puzzle } from 'src/app/model/puzzle';
import { GridCellEditor } from './grid-editors/grid-cell-editor';
import { GridCellEditorFluid } from './grid-editors/grid-cell-editor-fluid';
import { GridEntryEditor } from './grid-editors/grid-entry-editor';
import { GridEntryEditorFluid } from './grid-editors/grid-entry-editor-fluid';

@Injectable({
    providedIn: 'root'
})
export class GridEditorService {

    constructor() { }

    public getEditor(token: Symbol): GridEditor {
        let editor: GridEditor;

        switch (token) {
            case GridEditors.cellEditor:
                editor = new GridCellEditor();
                break;
            case GridEditors.cellEditorFluid:
                editor = new GridCellEditorFluid();
                break;
            case GridEditors.entryEditor:
                editor = new GridEntryEditor();
                break;
            case GridEditors.entryEditorFluid:
                editor = new GridEntryEditorFluid();
                break;
            default:
                editor = new GridCellEditor();
                break;
        }
        return editor;
    }
}

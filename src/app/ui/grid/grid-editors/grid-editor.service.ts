import { Injectable } from '@angular/core';
import { GridEditor } from './grid-editor';
import { GridEditors } from '../../common';
import { GridCellEditor } from './grid-cell-editor';
import { GridCellEditorFluid } from './grid-cell-editor-fluid';
import { GridEntryEditor } from './grid-entry-editor';
import { GridEntryEditorFluid } from './grid-entry-editor-fluid';
import { GridCellEditorEmptyFluid } from './grid-cell-editor-empty-fluid';

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
            case GridEditors.cellEditorEmptyFluid:
                editor = new GridCellEditorEmptyFluid();
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

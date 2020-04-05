import { Injectable, Type } from '@angular/core';
import { ClueAnnotationComponent } from './clue-annotator/clue-annotator.component';
import { ClueTextEditorComponent } from './clue-text-editor/clue-text-editor.component';
import { GridLinkerComponent } from './grid-linker/grid-linker.component';
import { PuzzleOptionsComponent } from './puzzle-options/puzzle-options.component';

export type ClueEditorComponentName = "ClueAnnotationComponent" | "ClueTextEditorComponent" | "GridLinkerComponent" | "PuzzleOptionsComponent";

@Injectable({
    providedIn: 'root'
})
export class EditorComponentFactory {
    public getComponent(componentId: ClueEditorComponentName): Type<any> {
        let component: Type<any> = null;

        switch(componentId) {
            case "ClueAnnotationComponent":
                component = ClueAnnotationComponent;
                break;
            case "ClueTextEditorComponent":
                component = ClueTextEditorComponent;
                break;
            case "GridLinkerComponent":
                component = GridLinkerComponent;
                break;
            case "PuzzleOptionsComponent":
                component = PuzzleOptionsComponent;
                break;
        }

        return component;
    }
}
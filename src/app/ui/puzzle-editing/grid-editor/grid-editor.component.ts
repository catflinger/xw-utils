import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GridCell } from 'src/app/model/grid-cell';
import { Puzzle } from 'src/app/model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Clear } from 'src/app/services/modifiers/clear';
import { UpdateCell } from 'src/app/services/modifiers/update-cell';
import { BarClickEvent, GridTextEvent, GridNavigationEvent, GridComponent } from '../../components/grid/grid.component';
import { RenumberGid } from 'src/app/services/modifiers/renumber-grid';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { UpdateGridProperties } from 'src/app/services/modifiers/updare-grid-properties';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UpdateInfo } from 'src/app/services/modifiers/update-info';
import { GridControlOptions, GridEditors } from '../../common';
import { GridEditor } from '../../services/grid-editors/grid-editor';
import { GridEditorService } from '../../services/grid-editors/grid-editor.service';
import { ClearShading } from 'src/app/services/modifiers/clear-shading';
import { AppService } from '../../services/app.service';
import { DownloadInstance } from '../../components/download-button/download-button.component';
import { NavService } from '../../navigation/nav.service';
import { AppTrackData } from '../../navigation/tracks/app-track-data';

type ToolType = "grid" | "text" | "color" | "properties";

@Component({
    selector: 'app-grid-editor',
    templateUrl: './grid-editor.component.html',
    styleUrls: ['./grid-editor.component.css']
})
export class GridEditorComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public form: FormGroup;
    public symmetrical: boolean = true;
    public options: GridControlOptions = { editor: GridEditors.cellEditor, showShading: false };
    public gridEditors = GridEditors;
    public shadingColor: string;

    @ViewChild(GridComponent, { static: false }) 
    public gridControl: GridComponent;

    private subs: Subscription[] = [];
    private tool: ToolType = "grid";

    private gridEditor: GridEditor;

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private formBuilder: FormBuilder,
        private gridEditorService: GridEditorService,
    ) { }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            title: ["", Validators.required],
        });

        // TO DO: record preferences for next time
        this.shadingColor = "#ffebcd";

        this.gridEditor = this.gridEditorService.getEditor(this.options.editor);

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {
            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        if (!puzzle.capability.gridable) {
                            this.navService.goHome();
                        }
                        this.form.patchValue({title: puzzle.info.title});
                        this.symmetrical = puzzle.grid.properties.symmetrical;
                        this.puzzle = puzzle;
                    }
                ));
        }
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public get barred(): boolean {
        let result = false;

        if (this.puzzle && this.puzzle.grid.properties.style === "barred") {
            result = true;
        }
        return result;
    }

    // @HostListener('document:keypress', ['$event'])
    // handleKeyboardEvent(event: KeyboardEvent) {
    //     if (this.puzzle && !this.modalRef) {
    //         if (event.key === "Enter") {
    //             event.stopPropagation();
    //             let clue = this.puzzle.getSelectedClue();
    //             if (clue) {
    //                 this.openEditor(clue, null);
    //             }
    //         } else if (/[a-zA-Z]/.test(event.key)) {
    //             event.stopPropagation();
    //             let clue = this.puzzle.getSelectedClue();
    //             if (clue) {
    //                 this.openEditor(clue, event.key);
    //             }
    //         }
    //     }
    // }

    public onTabChange(event: NgbTabChangeEvent) {
        this.appService.clear();
        this.tool = event.nextId as ToolType;
        this.options.showShading = event.nextId === "color";
        this.activePuzzle.update(new Clear());
    }

    public onContinue() {
        this.appService.clear();
        this.activePuzzle.update(new Clear());
        this.navService.navigate("continue");
    }

    public onClose() {
        this.activePuzzle.update(new Clear());
        this.navService.goHome();
    }

    public onSubmit() {
        this.appService.clear();
        this.activePuzzle.update(new UpdateInfo({
            title: this.form.value.title
        }));
    }

    public onSymmetrical(val: boolean) {
        this.appService.clear();
        this.activePuzzle.update(new UpdateGridProperties({
            symmetrical: val,
        }));
    }

    public onCellClick(cell: GridCell) {
        this.appService.clear();
        switch(this.tool) {
            case "grid":
                const symCell = this.getSymCell(cell);
                if (this.puzzle.grid.properties.style === "standard") {
                    this.activePuzzle.update(new UpdateCell(cell.id, { light: !cell.light }));
                    if (symCell) {
                        this.activePuzzle.update(new UpdateCell(symCell.id, { light: !cell.light }));
                    }
                    this.activePuzzle.update(new RenumberGid());
                }
                break;

            case "text":
                if (cell.light) {
                    if (cell.highlight) {
                        // cell is already part of a text edit
                        let updates = this.gridEditor.onGridNavigation(this.puzzle, "absolute", { x: cell.x, y: cell.y});
                        updates.forEach(update => this.activePuzzle.update(update));
                    } else {
                        // this is a new edit
                        let updates = this.gridEditor.startEdit(this.puzzle, cell);
                        updates.forEach(update => this.activePuzzle.update(update));
                    }

                } else {
                    this.activePuzzle.update(new Clear());
                }
                break;
                
            case "color":
                let color: string = cell.shading && cell.shading === this.shadingColor ? null : this.shadingColor;
                this.activePuzzle.update(new UpdateCell(cell.id, { shading: color }));
                break;
                        
            default:
                // do nothing
                break;
        }
    }

    public onBarClick(event: BarClickEvent) {
        this.appService.clear();

        if (this.tool === "grid" && this.puzzle.grid.properties.style === "barred") {
            if (event.bar === "rightBar") {
                this.activePuzzle.update(new UpdateCell(event.cell.id, { rightBar: !event.cell.rightBar }));
            } else {
                this.activePuzzle.update(new UpdateCell(event.cell.id, { bottomBar: !event.cell.bottomBar }));
            }
            this.activePuzzle.update(new RenumberGid());
        }
    }

    public onOptionChange() {
        this.appService.clear();

        this.activePuzzle.update(new Clear());
        this.gridEditor = this.gridEditorService.getEditor(this.options.editor);
    }

    public onGridText(event: GridTextEvent) {
        this.appService.clear();

        let updates = this.gridEditor.onGridText(this.puzzle, event.text, event.writingDirection);
        updates.forEach(update => this.activePuzzle.update(update));
    }

    public onGridNavigation(event: GridNavigationEvent) {
        this.appService.clear();

        let updates = this.gridEditor.onGridNavigation(this.puzzle, event.navigation);
        updates.forEach(update => this.activePuzzle.update(update));
    }

    public onClearAll() {
        this.appService.clear();

        this.activePuzzle.update(new ClearShading());
    }

    public onDownload(instance: DownloadInstance) {
        this.appService.clear();
        instance.download("grid-image.png", this.gridControl.getDataUrl());
    }

    private getSymCell(cell: GridCell): GridCell {
        let result: GridCell = null;

        if (this.puzzle.grid.properties.symmetrical) {
            // rotational symmetry

            // TO DO: allow for other types of symmetry
            // use matricies and transformations?

            result = this.puzzle.grid.cellAt(
                this.puzzle.grid.properties.size.across - 1 - cell.x, 
                this.puzzle.grid.properties.size.down -  1- cell.y, 
            );
        }

        return result;
    }
}

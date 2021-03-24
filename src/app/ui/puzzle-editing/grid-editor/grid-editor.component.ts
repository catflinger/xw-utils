import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectionStrategy, ChangeDetectorRef, ElementRef, Input } from '@angular/core';
import { Subscription } from 'rxjs';
import { GridCell } from 'src/app/model/puzzle-model/grid-cell';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Clear } from 'src/app//modifiers/puzzle-modifiers/clear';
import { UpdateCell } from 'src/app//modifiers/grid-modifiers/update-cell';
import { RenumberGid } from 'src/app//modifiers/grid-modifiers/renumber-grid';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { UpdateGridProperties } from 'src/app//modifiers/grid-modifiers/updare-grid-properties';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UpdateInfo } from 'src/app//modifiers/puzzle-modifiers/update-info';
import { GridControlOptions, GridEditors } from '../../common';
import { GridEditor } from '../../grid/grid-editors/grid-editor';
import { GridEditorService } from '../../grid/grid-editors/grid-editor.service';
import { ClearShading } from 'src/app//modifiers/grid-modifiers/clear-shading';
import { AppService } from '../../general/app.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import { IPuzzleModifier } from 'src/app/modifiers/puzzle-modifier';
import { GridComponent, BarClickEvent, GridTextEvent, GridNavigationEvent } from '../../grid/grid/grid.component';

type ToolType = "grid" | "text" | "color" | "properties";

@Component({
    selector: 'app-grid-editor',
    templateUrl: './grid-editor.component.html',
    styleUrls: ['./grid-editor.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GridEditorComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public form: FormGroup;
    public symmetrical: boolean = true;
    public numbered: boolean = true;
    public options: GridControlOptions = { editor: GridEditors.cellEditor, hideShading: true };
    public gridEditors = GridEditors;
    public shadingColor: string;

    public dataUrl: string;
    public filename: string;

    @ViewChild("downloadLink", { static: false }) downloadLink: ElementRef;
    @ViewChild(GridComponent, { static: false }) gridControl: GridComponent;

    private subs: Subscription[] = [];
    public tool: ToolType = "grid";

    private gridEditor: GridEditor;

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private formBuilder: FormBuilder,
        private gridEditorService: GridEditorService,
        private detRef: ChangeDetectorRef,
    ) { }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            title: ["", Validators.required],
        });

        // TO DO: record preferences for next time
        this.shadingColor = "#f0f8ff";

        this.gridEditor = this.gridEditorService.getEditor(this.options.editor);

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {
            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        if (puzzle) {
                            if (!puzzle.grid) {
                                this.navService.goHome();
                            }
                            this.form.patchValue({title: puzzle.info.title});
                            this.symmetrical = puzzle.grid.properties.symmetrical;
                            this.numbered = puzzle.grid.properties.numbered;
                        }
                        this.puzzle = puzzle;
                        this.detRef.detectChanges();
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

    public onTabChange(event: NgbTabChangeEvent) {
        this.appService.clear();
        //this.tool = event.nextId as ToolType;
        this.options.hideShading = event.nextId !== "color";
        this.activePuzzle.updateAndCommit(new Clear());
        this.detRef.detectChanges();
    }

    public onContinue() {
        this.appService.clear();
        this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("continue");
    }

    public onNina() {
        this.appService.clear();
        this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("nina");
    }

    public onClose() {
        this.appService.clear();
        this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("close");
    }

    public onSubmit() {
        this.appService.clear();
        this.activePuzzle.updateAndCommit(new UpdateInfo({
            title: this.form.value.title
        }));
    }

    public onSymmetrical(val: boolean) {
        this.appService.clear();
        this.activePuzzle.updateAndCommit(new UpdateGridProperties({
            symmetrical: val,
        }));
    }

    public onNumbered() {
        // TO DO: Use reactive forms and observe grid properties
        this.appService.clear();
        this.activePuzzle.updateAndCommit(
            new UpdateGridProperties({ numbered: !this.numbered }),
            new RenumberGid(),
        );
    }

    public onCellClick(cell: GridCell) {
        this.appService.clear();
        switch(this.tool) {
            case "grid":
                const symCell = this.getSymCell(cell);
                if (this.puzzle.grid.properties.style === "standard") {
                    const newVal = !cell.light;

                    this.activePuzzle.updateAndCommit(new UpdateCell(cell.id, { light: newVal }));
                    if (symCell) {
                        this.activePuzzle.updateAndCommit(new UpdateCell(symCell.id, { light: newVal }));
                    }
                    this.activePuzzle.updateAndCommit(new RenumberGid());
                }
                break;

            case "text":
                if (cell.light) {
                    if (cell.highlight) {
                        // cell is already part of a text edit
                        let updates = this.gridEditor.onGridNavigation(this.puzzle, "absolute", { x: cell.x, y: cell.y});
                        updates.forEach(update => this.activePuzzle.updateAndCommit(update));
                    } else {
                        // this is a new edit
                        let updates = this.gridEditor.startEdit(this.puzzle, cell);
                        updates.forEach(update => this.activePuzzle.updateAndCommit(update));
                    }

                } else {
                    this.activePuzzle.updateAndCommit(new Clear());
                }
                break;
                
            case "color":
                let color: string = cell.shading && cell.shading === this.shadingColor ? null : this.shadingColor;
                this.activePuzzle.updateAndCommit(new UpdateCell(cell.id, { shading: color }));
                break;
                        
            default:
                // do nothing
                break;
        }
    }

    public onBarClick(event: BarClickEvent) {
        this.appService.clear();
        let updates: IPuzzleModifier[] = [];

        if (this.tool === "grid" && this.puzzle.grid.properties.style === "barred") {
            const cell = event.cell;
            let symCell = this.getSymCell(cell);

            if (event.bar === "rightBar") {
                updates.push(new UpdateCell(cell.id, { rightBar: !cell.rightBar }));

                if (symCell && symCell.x > 0) {
                    // sym cell needs to alter the left bar, so use right bar from neighbouring cell
                    symCell = this.puzzle.grid.cellAt(symCell.x - 1, symCell.y);
                    updates.push(new UpdateCell(symCell.id, { rightBar: !cell.rightBar }));
                }
            } else {
                updates.push(new UpdateCell(cell.id, { bottomBar: !cell.bottomBar }));

                if (symCell && symCell.y > 0) {
                    // sym cell needs to alter the top bar, so use bottom bar from cell above
                    symCell = this.puzzle.grid.cellAt(symCell.x, symCell.y - 1);
                    updates.push(new UpdateCell(symCell.id, { bottomBar: !cell.bottomBar }));
                }
            }
            updates.push(new RenumberGid());

            this.activePuzzle.updateAndCommit(...updates);
        }
    }

    public onOptionChange() {
        this.appService.clear();

        this.activePuzzle.updateAndCommit(new Clear());
        this.gridEditor = this.gridEditorService.getEditor(this.options.editor);
    }

    public onGridText(event: GridTextEvent) {
        this.appService.clear();

        let updates = this.gridEditor.onGridText(this.puzzle, event.text, event.writingDirection);
        updates.forEach(update => this.activePuzzle.updateAndCommit(update));
    }

    public onGridNavigation(event: GridNavigationEvent) {
        this.appService.clear();

        let updates = this.gridEditor.onGridNavigation(this.puzzle, event.navigation);
        updates.forEach(update => this.activePuzzle.updateAndCommit(update));
    }

    public onClearAll() {
        this.appService.clear();

        this.activePuzzle.updateAndCommit(new ClearShading());
    }

    public onDownload() {
        this.appService.clear();
        this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("image");

        // this.filename = "grid-image.png";
        // this.dataUrl = this.gridControl.getDataUrl();

        // setTimeout(
        //     () => {
        //         this.downloadLink.nativeElement.click();
        //     },
        //     250
        // );
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

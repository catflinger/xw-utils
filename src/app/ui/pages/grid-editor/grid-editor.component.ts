import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GridCell } from 'src/app/model/grid-cell';
import { Puzzle } from 'src/app/model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Clear } from 'src/app/services/modifiers/clear';
import { UpdateCell } from 'src/app/services/modifiers/update-cell';
import { BarClickEvent, GridTextEvent } from '../../components/grid/grid.component';
import { RenumberGid } from 'src/app/services/modifiers/renumber-grid';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';
import { UpdateGridProperties } from 'src/app/services/modifiers/updare-grid-properties';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UpdateInfo } from 'src/app/services/modifiers/update-info';
import { SelectCellForEdit } from 'src/app/services/modifiers/select-cell-for-edit';
import { GridOptions } from '../../common';
import { GridNavigation } from 'src/app/model/interfaces';

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
    //public selectSingle: boolean = true;
    public options: GridOptions = { selectSingle: false };

    private subs: Subscription[] = [];
    private tool: ToolType = "grid";

    constructor(
        private activePuzzle: IActivePuzzle,
        private router: Router,
        private formBuilder: FormBuilder,
    ) { }

    ngOnInit() {
        this.form = this.formBuilder.group({
            title: ["", Validators.required],
        });

        if (!this.activePuzzle.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {
            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        if (!puzzle.info.gridable) {
                            this.router.navigate(["home"]);
                        }
                        this.form.patchValue({title: puzzle.info.title});
                        this.symmetrical = puzzle.grid.properties.symmetrical;
                        this.puzzle = puzzle;
                    }
                ));
        }
    }

    ngOnDestroy() {
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

    onTabChange(event: NgbTabChangeEvent) {
        this.tool = event.nextId as ToolType;
        this.activePuzzle.update(new Clear());
    }

    onContinue() {
        this.activePuzzle.update(new Clear());
        this.router.navigate(["/home"]);
    }

    onClose() {
        this.activePuzzle.update(new Clear());
        this.router.navigate(["/home"]);
    }

    onSubmit() {
        this.activePuzzle.update(new UpdateInfo({
            title: this.form.value.title
        }));
    }

    onSymmetrical(val: boolean) {
        this.activePuzzle.update(new UpdateGridProperties({
            symmetrical: val,
        }));
    }

    onCellClick(cell: GridCell) {
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
                // TO DO: show some sort of input
                if (cell.light) {
                    this.activePuzzle.update(new SelectCellForEdit(cell.id));
                } else {
                    this.activePuzzle.update(new Clear());
                }
                break;
                
            case "color":
                // TO DO: set a highlight colour on this cell
                break;
                        
            default:
                // do nothing
                break;
        }
    }

    onBarClick(event: BarClickEvent) {
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
        this.activePuzzle.update(new Clear());
    }

    public onGridText(event: GridTextEvent) {

        switch (event.eventType) {

            case "write" :
                //enter a text character
                this.setEditCellText(event.text.toUpperCase());
                
                if (this.options && this.options.selectSingle) {
                    this.activePuzzle.update(new Clear());
                } else {
                    this.selectNextCellForEdit("right");
                }
                break;

            case "clear":
                //clear the contents
                this.setEditCellText("");

                if (event.navigation) {
                    this.selectNextCellForEdit(event.navigation);
                } else {
                    this.activePuzzle.update(new Clear());
                }
                break;

            case "navigate":
                this.selectNextCellForEdit(event.navigation);
                break;

            case "cancel":
                //cancel the edit
                this.activePuzzle.update(new Clear());
                break;
        }
    }

    private setEditCellText(text: string) {
        this.puzzle.grid.cells.forEach((cell) => {
            if (cell.edit) {
                this.activePuzzle.update(new UpdateCell(cell.id, { content: text }));
            }
        });
    }

    private selectNextCellForEdit(orientation: GridNavigation) {

        const next = this.getNextCellForEdit(orientation);

        if (next) {
            this.activePuzzle.update(new SelectCellForEdit(next.id));
        } else {
            this.activePuzzle.update(new Clear());
        }
    }

    private getNextCellForEdit(orientation: GridNavigation): GridCell {
        let result: GridCell = null;

        const startCell = this.puzzle.grid.cells.find(c => c.edit);
        if (startCell) {
            let navigator = this.puzzle.grid.getNavigator(startCell.id, orientation);
            
            let next: IteratorResult<GridCell> = navigator.next();

            while (!next.done) {

                // TO DO: change behaviour according to the selected options
                // eg skip cells not part of words
                if (next.value.light) {
                    result = next.value;
                    break;
                }
                next = navigator.next();
            }
        }
        return result;
    }

    private getSymCell(cell: GridCell): GridCell {
        let result: GridCell = null;

        if (this.puzzle.grid.properties.symmetrical) {
            // rotational symmetry
            result = this.puzzle.grid.cellAt(
                this.puzzle.grid.properties.size.across - 1 - cell.x, 
                this.puzzle.grid.properties.size.down -  1- cell.y, 
            );
        }

        return result;
    }
}

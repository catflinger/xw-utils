import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { GridCell } from 'src/app/model/grid-cell';
import { Puzzle } from 'src/app/model/puzzle';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { ClearSelection } from 'src/app/services/modifiers/clear-selection';
import { UpdateCell } from 'src/app/services/modifiers/update-cell';
import { BarClickEventParameter } from '../../components/grid/grid.component';
import { RenumberGid } from 'src/app/services/modifiers/renumber-grid';
import { NgbTabChangeEvent } from '@ng-bootstrap/ng-bootstrap';

type ToolType = "bar" | "text" | "color" | "properties";

@Component({
    selector: 'app-grid-editor',
    templateUrl: './grid-editor.component.html',
    styleUrls: ['./grid-editor.component.css']
})
export class GridEditorComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    private subs: Subscription[] = [];

    private tool: ToolType = "bar";

    constructor(
        private activePuzzle: IActivePuzzle,
        private router: Router) { }

    ngOnInit() {
        if (!this.activePuzzle.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {
            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        if (!puzzle.info.gridable) {
                            this.router.navigate(["home"]);
                        }
        
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

        if (this.puzzle && this.puzzle.grid.style === "barred") {
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
    }

    onContinue() {
        this.activePuzzle.update(new ClearSelection());
        this.router.navigate(["/home"]);
    }

    onClose() {
        this.activePuzzle.update(new ClearSelection());
        this.router.navigate(["/home"]);
    }

    onCellClick(cell: GridCell) {
        switch(this.tool) {
            case "bar":
                if (this.puzzle.grid.style === "standard") {
                    this.activePuzzle.update(new UpdateCell(cell.id, { light: !cell.light }));
                    this.activePuzzle.update(new RenumberGid());
                }
                break;

            case "text":
                // TO DO: show some sort of input
                console.log("setting text on cell");
                break;
                
            case "color":
                // TO DO: set a highlight colour on this cell
                console.log("setting highlight on cell");
                break;
                        
            default:
                // do nothing
                break;
        }
    }

    onBarClick(event: BarClickEventParameter) {
        if (this.tool === "bar" && this.puzzle.grid.style === "barred") {
            if (event.bar === "rightBar") {
                this.activePuzzle.update(new UpdateCell(event.cell.id, { rightBar: !event.cell.rightBar }));
            } else {
                this.activePuzzle.update(new UpdateCell(event.cell.id, { bottomBar: !event.cell.bottomBar }));
            }
            this.activePuzzle.update(new RenumberGid());
        }
    }
}

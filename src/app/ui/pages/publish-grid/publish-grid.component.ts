import { Component, OnInit } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle';
import { Subscription } from 'rxjs';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Router, ChildActivationStart } from '@angular/router';
import { GridCell } from 'src/app/model/grid-cell';
import { UpdateCell } from 'src/app/services/modifiers/update-cell';
import { ClearShading } from 'src/app/services/modifiers/clear-shading';

@Component({
  selector: 'app-publish-grid',
  templateUrl: './publish-grid.component.html',
  styleUrls: ['./publish-grid.component.css']
})
export class PublishGridComponent implements OnInit {
    public puzzle: Puzzle = null;
    private subs: Subscription[] = [];
    public color: string;

    constructor(
        private activePuzzle: IActivePuzzle, 
        private router: Router) { }

        public ngOnInit() {
            // TO DO: record preferences for next time
        this.color = "#ffebcd";

        if (!this.activePuzzle.hasPuzzle) {
            this.router.navigate(["/home"]);
        } else {
            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        this.puzzle = puzzle;
                    }
            ));
        }
    }

    public ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onCellClick(cell: GridCell) {
        
        // overwrite if a new color, clear if the same color
        let color: string = cell.shading && cell.shading === this.color ? null : this.color;
        this.activePuzzle.update(new UpdateCell(cell.id, color));
    }

    public onContinue() {
        this.router.navigate(["/publish-preamble"]);
    }

    public onBack() {
        this.router.navigate(["/publish-options"]);
    }

    public onClearAll() {
        this.activePuzzle.update(new ClearShading());
    }
}

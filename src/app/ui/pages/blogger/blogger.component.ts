import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { Puzzle } from 'src/app/model/puzzle';
import { Clear } from 'src/app/services/modifiers/clear';
import { SelectClue } from 'src/app/services/modifiers/select-clue';
import { SelectNextClue } from 'src/app/services/modifiers/select-next-clue';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { AppService } from '../../services/app.service';

@Component({
  selector: 'app-blogger',
  templateUrl: './blogger.component.html',
  styleUrls: ['./blogger.component.css']
})
export class BloggerComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public appSettings;
    private subs: Subscription[] = [];

    constructor(
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private appSettinsgService: AppSettingsService, 
        private router: Router) { }

    ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.appService.goHome();
        } else {
            this.appSettings = this.appSettinsgService.settings;

            this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
                if (puzzle) {
                    if (!puzzle.info.blogable) {
                        this.appService.goHome();
                    }
                    this.puzzle = puzzle;
                }
            }));

            this.subs.push(this.appSettinsgService.observe().subscribe(settings => this.appSettings = settings));
        }
    }

    ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.appService.navContext.track = "publish";
        this.router.navigate(["/publish-options"]);
    }

    onClose() {
        this.activePuzzle.update(new Clear());
        this.appService.goHome();
    }

    onSolver() {
        this.appService.navContext.editor = "solver";
        this.router.navigate(["/solver"]);
    }

    onRowClick(clue: Clue) {
        this.activePuzzle.update(new SelectClue(clue.id));
    }

    onEditorClose(clue: Clue, reason: string) {
        if (reason === "cancel") {
            this.activePuzzle.update(new Clear());
        } else {
            this.activePuzzle.update(new SelectNextClue(clue.id));
        }
    }
}

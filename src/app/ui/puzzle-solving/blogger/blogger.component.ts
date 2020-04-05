import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { Puzzle } from 'src/app/model/puzzle';
import { Clear } from 'src/app//modifiers/puzzle-modifiers/clear';
import { SelectClue } from 'src/app//modifiers/clue-modifiers/select-clue';
import { SelectNextClue } from 'src/app//modifiers/clue-modifiers/select-next-clue';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { AppService } from '../../services/app.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';

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
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
        private appSettinsgService: AppSettingsService, 
    ) { }

    ngOnInit() {

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {
            this.appSettings = this.appSettinsgService.settings;

            this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
                if (puzzle) {
                    if (!puzzle.capability.blogable) {
                        this.navService.goHome();
                    }
                    this.puzzle = puzzle;

                    //console.log("BLOGGER " + JSON.stringify(puzzle.clues));
                }
            }));

            this.subs.push(this.appSettinsgService.observe().subscribe(settings => this.appSettings = settings));
        }
    }

    ngOnDestroy(){
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.navService.navigate("continue");
    }

    onBack() {
        this.activePuzzle.updateAndCommit(new Clear());
        this.navService.navigate("back");
    }

    onSolver() {
        this.navService.navigate("solve");
    }

    onEditClues() {
        this.navService.navigate("edit");
    }

    onRowClick(clue: Clue) {
        this.activePuzzle.updateAndCommit(new SelectClue(clue.id));
    }

    onEditorClose(clue: Clue, reason: string) {
        if (reason === "cancel") {
            this.activePuzzle.updateAndCommit(new Clear());
        } else {
            this.activePuzzle.updateAndCommit(new SelectNextClue(clue.id));
        }
    }
}

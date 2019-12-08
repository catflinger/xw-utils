import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { AppService, AppStatus } from 'src/app/ui/services/app.service';
import { TextStyle } from 'src/app/model/text-style';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { Clue } from 'src/app/model/clue';
import { Puzzle } from 'src/app/model/puzzle';
import { UpdatePublsihOptions } from 'src/app/services/modifiers/update-publish-options';
import { PublishOptionsM } from 'src/app/services/modifiers/mutable-model/publish-options-m';
import { NavService } from '../../navigation/nav.service';

@Component({
    selector: 'app-publish-options',
    templateUrl: './publish-options.component.html',
    styleUrls: ['./publish-options.component.css']
})
export class PublishOptionsComponent implements OnInit, OnDestroy {
    public puzzle: Puzzle = null;
    public appStatus: AppStatus;
    public sample: Clue[];
    public publishOptions: PublishOptionsM = null;
    
    private subs: Subscription[] = [];

    constructor(
        private navService: NavService,
        private appService: AppService,
        private activePuzzle: IActivePuzzle,
    ) { }

    ngOnInit() {

        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        } else {

            this.subs.push(
                this.activePuzzle.observe().subscribe(
                    (puzzle) => {
                        if (puzzle) {
                            this.puzzle = puzzle;
                            this.sample = this.puzzle.clues.filter((c, i) => i < 3);
                            this.publishOptions = this.puzzle.publishOptions;
                        }
                    }
                ));
        }
    }

    ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    onContinue() {
        this.activePuzzle.update(new UpdatePublsihOptions(this.publishOptions));
        this.navService.goNext("continue");
    }

    onBack() {
        this.activePuzzle.update(new UpdatePublsihOptions(this.publishOptions));
        this.navService.goNext("back");
    }

    onGrid() {
        this.activePuzzle.update(new UpdatePublsihOptions(this.publishOptions));
        this.navService.goNext("grid");
    }

}

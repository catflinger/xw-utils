import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { Direction } from 'src/app/model/interfaces';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/puzzle-model/clue';
import { SelectClue } from 'src/app//modifiers/clue-modifiers/select-clue';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AppSettings } from 'src/app/services/common';

@Component({
    selector: 'app-clue-list',
    templateUrl: './clue-list.component.html',
    styleUrls: ['./clue-list.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClueListComponent implements OnInit {
    @Input() public direction: Direction;
    @Input() followRedirects: boolean;
    @Output() public clueClick = new EventEmitter<Clue>();

    private subs: Subscription[] = [];
    public clues: Clue[] = [];
    public appSettings: AppSettings;

    constructor(
        private appSettingsService: AppSettingsService,
        private activePuzzle: IActivePuzzle,
        private detRef: ChangeDetectorRef,
        ) { }

    ngOnInit() {
        this.appSettings = this.appSettingsService.settings;
        this.subs.push(this.appSettingsService.observe().subscribe(settings => this.appSettings = settings));

        this.subs.push(this.activePuzzle.observe().subscribe(
            (puzzle) => {
                if (puzzle && puzzle.clues) {
                    this.clues = puzzle.clues.filter((clue) => clue.group === this.direction)
                }
                this.detRef.detectChanges();
            }
        ));
    }

    public onClueClick(clue: Clue) {
        if (clue.highlight) {
            this.clueClick.emit(clue);
        } else {
            let target = clue;

            if (this.followRedirects && clue.redirect) {
                // TO DO: ...
                let exp = new RegExp(String.raw`^\s*see\s+(?<target>(\d{1,2}|across|down| |,)+)\s*$`, "i");
                const match = exp.exec(clue.text);

                if (match) {
                    const parts = match.groups["target"].toString().split(",");

                    exp = new RegExp(String.raw`(<number>\d{1,2})\s*(?<direction>across|down|ac|dn)?`, "i");
                    const firstPart = parts[0];
                    const match2 = exp.exec(firstPart);

                    if (match2) {
                        const numberGroup = match2.groups["number"];
                        const directionGroup = match2.groups["direction"];

                        let redirectClueNumber = parseInt(numberGroup);
                        let redirectClueGroup =  directionGroup ? directionGroup.toString().toLowerCase() : clue.group;
                        redirectClueGroup = redirectClueGroup.charAt(0) === "a" ? "across" : "down";

                        // Now look for the clue for this entry...

                        // TO DO: how to do this???
                    }
                }

            }

            this.activePuzzle.updateAndCommit(new SelectClue(target.id));
            this.detRef.markForCheck();
        }
    }
}

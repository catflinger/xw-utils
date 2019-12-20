import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Direction } from 'src/app/model/interfaces';
import { Subscription } from 'rxjs';
import { Clue } from 'src/app/model/clue';
import { SelectClue } from 'src/app/services/modifiers/select-clue';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { AppSettings } from 'src/app/services/common';

@Component({
    selector: 'app-clue-list',
    templateUrl: './clue-list.component.html',
    styleUrls: ['./clue-list.component.css']
})
export class ClueListComponent implements OnInit {
    @Input() public direction: Direction;
    @Output() public clueClick = new EventEmitter<Clue>();

    private subs: Subscription[] = [];
    public clues: Clue[] = [];
    public appSettings: AppSettings;

    constructor(
        private appSettingsService: AppSettingsService,
        private activePuzzle: IActivePuzzle,
        ) { }

    ngOnInit() {
        this.appSettings = this.appSettingsService.settings;
        this.subs.push(this.appSettingsService.observe().subscribe(settings => this.appSettings = settings));

        this.subs.push(this.activePuzzle.observe().subscribe(
            (puzzle) => {
                if (puzzle && puzzle.clues) {
                    this.clues = puzzle.clues.filter((clue) => clue.group === this.direction)
                }
            }
        ));
    }

    public onClueClick(clue: Clue) {
        if (clue.highlight) {
            this.clueClick.emit(clue);
        } else {
            this.activePuzzle.update(new SelectClue(clue.id));
        }
    }
}

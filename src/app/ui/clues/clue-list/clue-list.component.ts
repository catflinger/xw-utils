import { Component, OnInit, Input, Output, EventEmitter, ChangeDetectionStrategy, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Direction, IClue } from 'src/app/model/interfaces';
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
export class ClueListComponent implements OnInit, OnDestroy {
    @Input() public direction: Direction;
    @Input() followRedirects: boolean = false;
    @Output() public clueClick = new EventEmitter<Clue>();

    private subs: Subscription[] = [];
    public clues: Clue[] = [];
    public appSettings: AppSettings;

    constructor(
        private appSettingsService: AppSettingsService,
        private activePuzzle: IActivePuzzle,
        private detRef: ChangeDetectorRef,
        ) { }

    public ngOnInit() {
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

    public ngOnDestroy() {
        this.subs.forEach(s => s.unsubscribe());
    }

    public onClueClick(clue: Clue) {

        if (clue.highlight) {
            this.clueClick.emit(clue);
        } else {
            this.activePuzzle.updateAndCommit(new SelectClue(clue.id, this.followRedirects));
            this.detRef.markForCheck();
        }
    }
}

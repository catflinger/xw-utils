import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Puzzle } from 'src/app/model/puzzle';
import { Clue } from 'src/app/model/clue';
import { AppSettings } from 'src/app/services/common';
import { IActivePuzzle } from 'src/app/services/puzzle-management.service';
import { AppSettingsService } from 'src/app/services/app-settings.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-clue-editor',
    templateUrl: './clue-editor.component.html',
    styleUrls: ['./clue-editor.component.css']
})
export class ClueEditorComponent implements OnInit {

    //@Input() puzzle: Puzzle;
    @Input() clueId: string;
    @Input() starterText: string;

    @Output() close = new EventEmitter<string>();

    //public appSettings: AppSettings;

    //private subs: Subscription[] = [];
    //private puzzle: Puzzle;

    constructor(
        //private activePuzzle: IActivePuzzle,
        //private appSettingsService: AppSettingsService,
    ) { }

    public ngOnInit() {
        // this.subs.push(this.appSettingsService.observe().subscribe(
        //     settings => {
        //         if (settings) {
        //             this.appSettings = settings;
        //         }
        //     }
        // ));

        // this.subs.push(this.activePuzzle.observe().subscribe(
        //     puzzle => {
        //         if (puzzle) {
        //             this.puzzle = puzzle;
        //         }
        //     }
        // ));
    }

    ngOnDestroy() {
//        this.subs.forEach(s => s.unsubscribe());
    }
    
    // public get clue(): Clue {
    //     let clue = null;

    //     if (this.puzzle) {
    //         clue = this.puzzle.clues.find(c => c.id === this.clueId);
    //     }

    //     return clue;
    // };

}

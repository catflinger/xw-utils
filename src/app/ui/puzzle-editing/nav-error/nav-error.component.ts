import { Component, OnInit, OnDestroy } from '@angular/core';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { Subscription } from 'rxjs';
import { TextParsingError } from 'src/app/model/puzzle-model/text-parsing-error';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';

@Component({
    selector: 'app-nav-error',
    templateUrl: './nav-error.component.html',
    styleUrls: ['./nav-error.component.css']
})
export class NavErrorComponent implements OnInit, OnDestroy {
    public localError: string = null;
    public provisionError: string = null;
    public navHistory: ReadonlyArray<string> = [];
    public appData: AppTrackData;

    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<any>,
        private activePuzzle: IActivePuzzle
    ) { }

    public ngOnInit() {
        try {
            this.appData = this.navService.appData;

            this.subs.push(this.activePuzzle.observe().subscribe(puzzle => {
                try {
                    if (puzzle) {
                        if (puzzle.provision) {
                            const errors: ReadonlyArray<TextParsingError> = puzzle.provision.parseErrors;
                            if (errors && errors.length > 0) {
                                this.provisionError = errors[0].message;
                            }
                        }
                    }
                } catch (error) {
                    this.localError = error.toString();
                }
            }));
        } catch (error) {
        }
    }

    public ngOnDestroy() {
        try {
            this.subs.forEach(s => s.unsubscribe());
        } catch {}
    }

}

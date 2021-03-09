import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { combineLatest, Subscription } from 'rxjs';
import { Puzzle } from 'src/app/model/puzzle-model/puzzle';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { AuthService } from 'src/app/services/app/auth.service';
import { AppSettings, ContentGenerator } from 'src/app/services/common';
import { TableLayout } from 'src/app/services/content-generator/table-layout';
import { ListLayout } from 'src/app/services/content-generator/list-layout';
import { NavService } from 'src/app/services/navigation/nav.service';
import { AppTrackData } from 'src/app/services/navigation/tracks/app-track-data';
import { IActivePuzzle } from 'src/app/services/puzzles/puzzle-management.service';
import { AppService, AppStatus } from '../../general/app.service';
import { GridComponent } from '../../grid/grid/grid.component';
import { fifteenSquaredBlack } from '../../common';

@Component({
    selector: 'app-content-preview',
    templateUrl: './content-preview.component.html',
    styleUrls: ['./content-preview.component.css'],
})
export class ContentPreviewComponent implements OnInit, AfterViewInit, OnDestroy {
    public puzzle: Puzzle = null;
    public appStatus: AppStatus;
    public appSettings: AppSettings;
    public debugContent: string = "";
    public username: string = null;

    public black = fifteenSquaredBlack;

    private subs: Subscription[] = [];
    //private gridControl: GridComponent;

    @ViewChildren(GridComponent ) children: QueryList<GridComponent>;
    
    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private authService: AuthService,
        private appSettingsService: AppSettingsService,
        private activePuzzle: IActivePuzzle,
        private listLayout: ListLayout,
        private tableLayout: TableLayout,
        private detRef: ChangeDetectorRef,) { }

    ngOnInit() {
        window.scrollTo(0, 0);
        
        this.username = this.authService.getCredentials().username;

        this.subs.push(this.appService.getObservable().subscribe(appStatus => {
            this.appStatus = appStatus;
            this.detRef.detectChanges();
        }));
        this.subs.push(this.appSettingsService.observe().subscribe(settings => {
            this.appSettings = settings;
            this.detRef.detectChanges();
        }));

        if (!this.activePuzzle.hasPuzzle) {
            this.navService.goHome();
        }
    }

    public ngAfterViewInit() {
        this.subs.push(
                this.activePuzzle.observe().subscribe(puzzle => {
                this.puzzle = puzzle;

                if (this.puzzle) {
                    const generator = this.puzzle.publishOptions.layout === "table" ? this.tableLayout : this.listLayout;
                    this.debugContent = generator.getContent(this.puzzle, this.getGridImage(this.children.first));
                }
                this.detRef.detectChanges();
            })
        );
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onClose() {
        this.navService.navigate("continue");
    }

    private getGridImage(gridControl: GridComponent): string {
        let result: string = null;

        try {
            result = gridControl.getDataUrl("png");
        } catch (error) {
            result = null;
        }

        return result;
    }
}

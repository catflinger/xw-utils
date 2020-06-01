import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, combineLatest } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

import { ArchiveItem } from 'src/app/model/archive-model/archive-item';
import { AppStatus, AppService } from 'src/app/ui/general/app.service';
import { ArchiveService } from 'src/app/services/puzzles/archive-source.service';
import { Archive } from 'src/app/model/archive-model/archive';
import { PuzzleProvider } from 'src/app/model/interfaces';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';

@Component({
    selector: 'app-archive',
    templateUrl: './archive.component.html',
    styleUrls: ['./archive.component.css'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ArchiveComponent implements OnInit, OnDestroy {
    public appStatus: AppStatus;
    public archive: Archive;
    public provider: PuzzleProvider;
    public form: FormGroup;

    private subs: Subscription[] = [];

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private archiveService: ArchiveService,
        private activeRoute: ActivatedRoute,
        private formBuilder: FormBuilder,
        private detRef: ChangeDetectorRef,
    ) { }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            date: ["", Validators.required], 
        });

        this.appService.clearAlerts();

        this.subs.push(
            combineLatest(
                this.appService.getObservable(),
                this.archiveService.observe(),
            ).subscribe(result => {
                this.appStatus = result[0];
                this.archive = result[1];
            })
        );

        this.subs.push(this.activeRoute.params.subscribe(params => {
            this.provider = params.provider;
            this.appService.setBusy();

            this.archiveService.getList(params.provider)
            .catch((error) => this.appService.setAlert("danger", error))
            .finally(() => {
                this.appService.clearBusy();
                this.detRef.detectChanges()
            });
        }))
    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public get showDate(): boolean {
        return this.provider &&
            (this.provider === 'independent' || this.provider === 'ios');
    }

    public openPuzzle(item: ArchiveItem) {
        this.appService.clear();

        this.appService.setOpenPuzzleParams({
            provider: item.provider,
            sourceUrl: item.url,
            serialNumber: item.serialNumber,
            date: item.date,
            setter: item.setter});

        this.appService.clearBusy();
        this.appService.clearAlerts();
        
        this.navService.beginTrack("createPdfTrack", {}, "open-puzzle");
    }

    public get latest(): ArchiveItem {
        let result = null;

        if (this.archive && this.provider) {
            const index = this.archive.getIndex(this.provider);
            if (index && index.items.length > 0) {
                result = index.items[0]; 
            }
        }

        return result;
    }

    public get archiveItems(): ReadonlyArray<ArchiveItem> {
        let items: ReadonlyArray<ArchiveItem> = [];

        if (this.archive && this.provider) {
            const index = this.archive.getIndex(this.provider);
            if (index && index.items.length > 1) {
                items = index.items.slice(1) as ReadonlyArray<ArchiveItem>; 
            }
        }

        return items;
    }
}

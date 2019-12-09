import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import moment from "moment";

import { ArchiveItem } from 'src/app/model/archive-item';
import { AppStatus, AppService, OpenPuzzleParamters } from 'src/app/ui/services/app.service';
import { ArchiveService } from 'src/app/services/archive-source.service';
import { Archive } from 'src/app/model/archive';
import { PuzzleProvider } from 'src/app/model/interfaces';
import { NavService } from '../../navigation/nav.service';
import { PublishingTrackData } from '../../navigation/tracks/publish-post-track';

@Component({
    selector: 'app-archive',
    templateUrl: './archive.component.html',
    styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit, OnDestroy {
    public appStatus: AppStatus;
    public archive: Archive;
    public provider: PuzzleProvider;
    public form: FormGroup;

    private subs: Subscription[] = [];

    constructor(
        private navService: NavService,
        private appService: AppService,
        private archiveService: ArchiveService,
        private activeRoute: ActivatedRoute,
        private formBuilder: FormBuilder,

    ) { }

    public ngOnInit() {

        this.form = this.formBuilder.group({
            date: ["", Validators.required], 
        });

        this.appService.clearAlerts();

        this.subs.push(this.appService.getObservable().subscribe(appStatus => this.appStatus = appStatus));

        this.subs.push(this.archiveService.observe().subscribe(archive => {
            this.archive = archive;
        }));

        this.subs.push(this.activeRoute.params.subscribe((params) => {

            this.provider = params.provider;
            this.appService.setBusy();

            this.archiveService.getList(params.provider)
            .catch((error) => {
                this.appService.setAlert("danger", error);
            })
            .finally(() => this.appService.clearBusy());
        }));
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
        
        this.navService.beginTrack({
            track: "publish-post", 
            data: new PublishingTrackData(null)
        });
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

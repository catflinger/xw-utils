import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import moment from "moment";

import { ArchiveItem } from 'src/app/model/archive-item';
import { AppStatus, AppService, EditorType, OpenPuzzleParameters } from 'src/app/ui/services/app.service';
import { ArchiveService } from 'src/app/services/archive-source.service';
import { Archive } from 'src/app/model/archive';

@Component({
    selector: 'app-archive',
    templateUrl: './archive.component.html',
    styleUrls: ['./archive.component.css']
})
export class ArchiveComponent implements OnInit, OnDestroy {
    public appStatus: AppStatus;
    public archive: Archive;
    public provider: string;
    public form: FormGroup;

    private subs: Subscription[] = [];

    constructor(
        private appService: AppService,
        private archiveService: ArchiveService,
        private router: Router,
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

    public get showList(): boolean {
        return this.provider 
            && this.archive 
            && (this.provider !== 'independent' && this.provider !== 'ios');
    }

    public openPuzzleByDate() {
        let item: ArchiveItem = {
            provider: this.provider,
            serialNumber: null,
            date: moment(this.form.value.date).toDate(),
            setter: null,
            url: null,
        };

        this.appService.clear();
        this.appService.setOpenPuzzleParams(new OpenPuzzleParameters("openLatest", this.provider, item));
        this.navigate("open-puzzle");
    }

    public openPuzzle(item: ArchiveItem) {
        this.appService.clear();
        this.appService.setOpenPuzzleParams(new OpenPuzzleParameters("openLatest", this.provider, item));
        this.navigate("open-puzzle");
    }

    public getItems() {
        let items: ReadonlyArray<ArchiveItem> = [];

        if (this.archive && this.provider) {
            const index = this.archive.getIndex(this.provider);
            if (index) {
                items = index.items; 
            }
        }

        return items;
    }

    private navigate (destination: string) {
        this.appService.clearBusy();
        this.appService.clearAlerts();
        this.router.navigate([destination])
    }
}

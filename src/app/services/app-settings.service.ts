import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IAppSettings {
    showCommentEditor: boolean,
    showTips: boolean,
}

export class AppSettings implements IAppSettings {
    constructor(
        public readonly showCommentEditor: boolean,
        public readonly showTips: boolean,
    ) {
    }
}

@Injectable({
    providedIn: 'root'
})
export class AppSettingsService {
    private bs: BehaviorSubject<AppSettings>;

    constructor() {
        this.bs = new BehaviorSubject<AppSettings>(
            new AppSettings(true, true));
    }

    public get settings() {
        return this.bs.value;
    }

    public observe(): Observable<AppSettings> {
        return this.bs.asObservable();
    }

    public hideCommentEditor() {
        let newSettings: IAppSettings = JSON.parse(JSON.stringify(this.bs.value));

        newSettings.showCommentEditor = false;
        this.bs.next(newSettings);
    }

    public showCommentEditor() {
        let newSettings: IAppSettings = JSON.parse(JSON.stringify(this.bs.value));

        newSettings.showCommentEditor = true;
        this.bs.next(newSettings);
    }

    public disableTips() {
        let newSettings: IAppSettings = JSON.parse(JSON.stringify(this.bs.value));

        newSettings.showTips = false;
        this.bs.next(newSettings);
    }

    public enableTips() {
        let newSettings: IAppSettings = JSON.parse(JSON.stringify(this.bs.value));

        newSettings.showTips = true;
        this.bs.next(newSettings);
    }

    public toggleCommentEditor() {
        if (this.bs.value.showCommentEditor) {
            this.hideCommentEditor();
        } else {
            this.showCommentEditor();
        }
    }

}

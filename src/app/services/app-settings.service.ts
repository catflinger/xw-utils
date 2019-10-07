import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface IAppSettings {
    showCommentEditor: boolean,
}

export class AppSettings implements IAppSettings {
    constructor(
        public readonly showCommentEditor: boolean,
    ) {
    }
}

@Injectable({
    providedIn: 'root'
})
export class AppSettingsService {
    //private appSettings: IAppSettings;
    private bs: BehaviorSubject<AppSettings>;

    constructor() {
        this.bs = new BehaviorSubject<AppSettings>(
            new AppSettings(true));
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

    public toggleCommentEditor() {
        if (this.bs.value.showCommentEditor) {
            this.hideCommentEditor();
        } else {
            this.showCommentEditor();
        }
    }

}

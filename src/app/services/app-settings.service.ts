import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

interface IAppSettings {
    showCommentEditor: boolean,
    showTips: boolean,
    username: string,
}

export class AppSettings implements IAppSettings {
    public readonly showCommentEditor: boolean;
    public readonly showTips: boolean;
    public readonly username: string;

    constructor(data: any) {
        this.showTips = data.showTips;
        this.showCommentEditor = data.showCommentEditor;
        this.username = data.username;
    }
}

const defaultSettings: AppSettings = {
    showTips: true,
    showCommentEditor: true,
    username: null,
};

type Modifier = (settings: IAppSettings) => void; 

@Injectable({
    providedIn: 'root'
})
export class AppSettingsService {
    private bs: BehaviorSubject<AppSettings>;

    constructor(private storageService: LocalStorageService) {
        let initialSettings: AppSettings = defaultSettings;

        let data = storageService.getUserSettings();
        if (data) {
            try {
                initialSettings = new AppSettings(JSON.parse(data));
            } catch {}
        }
        this.bs = new BehaviorSubject<AppSettings>(initialSettings);
    }

    public get settings() {
        return this.bs.value;
    }

    public observe(): Observable<AppSettings> {
        return this.bs.asObservable();
    }

    public set username(val: string) {
        this.update((settings) => {
            settings.username = val;
        });
    }

    public set showTips(val: boolean) {
        this.update((settings) => {
            settings.showTips = val;
        });
    }

    public hideCommentEditor() {
        this.update((settings) => {
            settings.showCommentEditor = false;
        });
    }

    public showCommentEditor() {
        this.update((settings) => {
            settings.showCommentEditor = true;
        });
    }

    public toggleCommentEditor() {
        if (this.bs.value.showCommentEditor) {
            this.hideCommentEditor();
        } else {
            this.showCommentEditor();
        }
    }

    public factoryReset() {
        this.update((settings) => {
            settings.showCommentEditor = true;
        });
    }

    private update(modifier: Modifier) {
        let newSettings: IAppSettings = JSON.parse(JSON.stringify(this.bs.value));
        modifier(newSettings);
        this.storageService.saveUserSettings(JSON.stringify(newSettings));
        this.bs.next(newSettings);
    }
}

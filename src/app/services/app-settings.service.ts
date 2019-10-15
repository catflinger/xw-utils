import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { TipSetting, AppSettings, TipSettings } from './common';

class _TipSetting implements TipSetting {
    constructor(
        public caption: string,
        public enabled: boolean,
    ) {}
}

class _TipSettings implements TipSettings {
    public general: _TipSetting;
    public definitionWarning: _TipSetting;
}

class _AppSettings implements AppSettings {
    public showCommentEditor: boolean;
    public username: string;
    public tips: _TipSettings;
}

const _defaultSettings: _AppSettings = {
    username: null,
    showCommentEditor: true,
    tips: {
        general: { caption: "show general tips", enabled: true },
        definitionWarning: { caption: "show missing defintion warning", enabled: true },
    }
};

type _Modifier = (settings: _AppSettings) => void;

export type TipKey = keyof _TipSettings;

@Injectable({
    providedIn: 'root'
})
export class AppSettingsService {
    private bs: BehaviorSubject<AppSettings>;

    constructor(private storageService: LocalStorageService) {
        this.bs = new BehaviorSubject<AppSettings>(_defaultSettings);

        let data = storageService.getUserSettings();
        if (data) {
            try {
                let newSettings = JSON.parse(data);
                this.update(newSettings);
            } catch { }
        }
    }

    public get settings() {
        return this.bs.value;
    }

    public observe(): Observable<AppSettings> {
        return this.bs.asObservable();
    }

    public update(changes: any) {
        // make a copy of the current settings then overwrite with values from any matching items in the changes object 
        this._update((_settings: _AppSettings) => {
            if (changes && changes.username && typeof changes.username === "string") {
                _settings.username = changes.username;
            }
            if (changes && typeof changes.showCommentEditor === "boolean") {
                _settings.showCommentEditor = changes.showCommentEditor;
            }
            if (changes && typeof changes.tips === "object") {
                Object.keys(_settings.tips).forEach(key => {
                    let newTip = changes.tips[key];
                    if (newTip && typeof newTip === "object" && typeof newTip.enabled === "boolean") {
                        _settings.tips[key].enabled = newTip.enabled;
                    }
                });
            }
        });
    }

    public set username(val: string) {
        this._update((settings) => {
            settings.username = val;
        });
    }

    public hideCommentEditor() {
        this._update((settings) => {
            settings.showCommentEditor = false;
        });
    }

    public showCommentEditor() {
        this._update((settings) => {
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
        this.storageService.saveUserSettings(JSON.stringify(_defaultSettings));
        this.update(_defaultSettings);
    }

    private _update(modifier: _Modifier) {
        let newSettings: _AppSettings = JSON.parse(JSON.stringify(this.bs.value));
        modifier(newSettings);
        this.storageService.saveUserSettings(JSON.stringify(newSettings));
        this.bs.next(newSettings);
    }
}


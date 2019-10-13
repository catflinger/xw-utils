import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';
import { TipSetting, TipKey, AppSettings } from './common';

const tipKeys: TipKey[] = ["general", "definitionWarning"];

class _TipSetting implements TipSetting {
    public key: TipKey;
    public enabled: boolean;

    constructor(
        key: TipKey,
        enabled: boolean,
            ) {
        this.key = key;
        this.enabled = enabled;
    }
}

class _AppSettings implements AppSettings {
    public showCommentEditor: boolean;
    public username: string;
    public tips: _TipSetting[];

    constructor(data: any) {
        this.showCommentEditor = data.showCommentEditor;
        this.username = data.username;

        let tips: _TipSetting[] = [];

        tipKeys.forEach(tk => {
            let newTip = new _TipSetting(tk, true);
            if (data.tips) {
                let tipData = data.tips.find(td => td.key === tk);
                if (tipData) {
                    newTip = new _TipSetting(tk, tipData.enabled);
                }
            }
            tips.push(newTip);
        });

        this.tips = tips;
    }

    public tipIsEnabled(key: TipKey) {
        let tipSetting = this.tips.find(t => t.key === key);
        return tipSetting ? tipSetting.enabled : true;
    }

}

const defaultSettings: AppSettings = new _AppSettings({
    username: null,
    showCommentEditor: true,
    tips: tipKeys.map(tk => {
        return { key: tk, enabled: true };
    })
});


type Modifier = (settings: _AppSettings) => void; 

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
                initialSettings = new _AppSettings(JSON.parse(data));
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

    public enableAllTips() {
        this.update((settings) => {
            settings.tips.forEach(ts => ts.enabled = true);
        });
    }

    public disableAllTips() {
        this.update((settings) => {
            settings.tips.forEach(ts => ts.enabled = false);
        });
    }

    public setTips(patches: TipSetting[]) {
        this.update((settings) => {
            settings.tips.forEach(ts => {
                let patch = patches.find(patch => patch.key === ts.key);
                if (patch) {
                    ts.enabled = patch.enabled;
                }
            });
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
        this.storageService.saveUserSettings(JSON.stringify(defaultSettings));
        this.bs.next(new _AppSettings(defaultSettings));
    }

    private update(modifier: Modifier) {
        let newSettings: _AppSettings = JSON.parse(JSON.stringify(this.bs.value));
        modifier(newSettings);
        this.storageService.saveUserSettings(JSON.stringify(newSettings));
        this.bs.next(new _AppSettings(newSettings));
    }
}


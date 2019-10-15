import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

interface BooleanSetting {
    readonly caption: string
    readonly enabled: boolean;
}

class _BooleanSetting implements BooleanSetting {
    constructor(
        public caption: string,
        public enabled: boolean,
    ) {}
}

class _GeneralSettings implements GeneralSettings {
    public showCommentEditor: _BooleanSetting;
    public showCheat: _BooleanSetting;
}

class _TipSettings implements TipSettings {
    public general: _BooleanSetting;
    public definitionWarning: _BooleanSetting;
}

class _AppSettings implements AppSettings {
    public username: string;
    public general: _GeneralSettings;
    public tips: _TipSettings;
}

const _defaultSettings: _AppSettings = {
    username: null,
    general: {
        showCommentEditor: { caption: "show comment editor", enabled: true },
        showCheat: { caption: "show cheat buttons", enabled: true },
    },
    tips: {
        general: { caption: "show general tips", enabled: true },
        definitionWarning: { caption: "show missing defintion warning", enabled: true },
    }
};

type _Modifier = (settings: _AppSettings) => void;

export interface GeneralSettings {
    readonly showCommentEditor: BooleanSetting;
    readonly showCheat: BooleanSetting;
}

export interface TipSettings {
    readonly general: BooleanSetting;
    readonly definitionWarning: BooleanSetting;
}

export interface AppSettings {
    readonly username: string;
    readonly general: GeneralSettings;
    readonly tips: TipSettings;
}

export type TipKey = keyof TipSettings;
export type GeneralKey = keyof GeneralSettings;
export type BooleanSettingsGroupKey = "general" | "tips";

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

            this._patchBooleanSettings(_settings, changes, "general");
            this._patchBooleanSettings(_settings, changes, "tips");
        });
    }

    public set username(val: string) {
        this._update((settings) => {
            settings.username = val;
        });
    }

    public hideCommentEditor() {
        this._update((settings) => {
            settings.general.showCommentEditor.enabled = false;
        });
    }

    public showCommentEditor() {
        this._update((settings) => {
            settings.general.showCommentEditor.enabled = true;
        });
    }

    public toggleCommentEditor() {
        if (this.bs.value.general.showCommentEditor.enabled) {
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

    private _patchBooleanSettings(currentSettings: _AppSettings, changes: any, group: BooleanSettingsGroupKey) {

        // For each of the settings in the given BooleanSettingsGroup it look for a matching
        // setting in the changes object and if we find one then apply the new value

        if (changes && typeof changes[group] === "object") {
            Object.keys(currentSettings[group]).forEach(key => {
                let newTip = changes[group][key];
                if (newTip && typeof newTip === "object" && typeof newTip.enabled === "boolean") {
                    currentSettings[group][key].enabled = newTip.enabled;
                }
            });
        }
    }
}


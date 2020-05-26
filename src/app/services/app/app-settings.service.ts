import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { LocalStorageService } from '../storage/local-storage.service';
import { BooleanSetting, GeneralSettings, TipSettings, DiarySettings, AppSettings, BooleanSettingsGroupKey, EditorMode } from '../common';
import { QuillDelta } from 'src/app/model/puzzle-model/quill-delta';

// TO DO: so far all the the settings have turned out to be related to the UI.
// Consider if we need an app-wide settings service.  Perhaps move this to the
// UI section of the project

class _BooleanSetting implements BooleanSetting {
    constructor(
        public caption: string,
        public enabled: boolean,
    ) {}
}

class _GeneralSettings implements GeneralSettings {
    //public showCommentEditor: _BooleanSetting;
    public showCommentValidation: _BooleanSetting;
    public showCheat: _BooleanSetting;
    public containerFluid: _BooleanSetting;
    public tabbedEditor: BooleanSetting;
}

class _TipSettings implements TipSettings {
    public general: _BooleanSetting;
    public definitionWarning: _BooleanSetting;
    public gridEditor: _BooleanSetting;
    public gridEditorText: _BooleanSetting;
    public gridStart: _BooleanSetting;
    public specialText: _BooleanSetting;
}

class _DiarySettings implements DiarySettings {
    public showEverybody: boolean;
    public aliases: string[];
}

class _AppSettings implements AppSettings {
    public username: string;
    public general: _GeneralSettings;
    public tips: _TipSettings;
    public sandbox: boolean;
    public footer: QuillDelta;
    public diary: _DiarySettings;
    public editorMode: EditorMode;
    public traceOutput: boolean;
}

/*
*   Steps to add a new tip or general boolean setting:
*
*   1) Add the name of the setting to one of the exported interfaces, either TipSettings or General Settings
*   2) Add an entry containing the caption and initial value to the _defaultSettings object below
*
*   The setting will automatically appear as a user configuration in the Settings page and will be available
*   for the app to use as appSettings.general.mynewname.enabled or appSettings.tps.mynewname.enabled.
*
*   Tips can be shown using the tip control <app-tip key="mynewnamme"> Your text goes here... </app-tip>
*/

// before adding more settings read the comment on interfaces GeneralSettings and TipSettings
const _defaultSettings: _AppSettings = {
    username: null,
    sandbox: false,
    editorMode: "modal",
    traceOutput: false,
    footer: { ops: []},
    general: {
        //showCommentEditor: { caption: "show comment editor", enabled: true },
        showCommentValidation: { caption: "show missing answers, comments, definitions etc", enabled: true },
        showCheat: { caption: "show cheat buttons", enabled: true },
        containerFluid: { caption: "display app full-width inside the browser", enabled: false },
        tabbedEditor: { caption: "show edit tabs in the clue editor", enabled: true },
    },
    tips: {
        general: { caption: "show general tips", enabled: true },
        definitionWarning: { caption: "show tip on highlighting definitions", enabled: true },
        gridEditor: { caption: "show tips on using the Grid Editor", enabled: true },
        gridEditorText: { caption: "show tips on entering text in grids", enabled: true },
        gridStart: { caption: "show tips on using the Grid Tool start page", enabled: true },
        specialText: { caption: "show tips on manually entering clue text", enabled: true },
    },
    diary: {
        showEverybody: false,
        aliases: ["PeeDee"]
    }
};

type _Modifier = (settings: _AppSettings) => void;


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
            if (changes) {
                if (changes.username !== undefined && 
                    (typeof changes.username === "string" || changes.username === null)) {
                    _settings.username = changes.username;
                }

                if (changes.footer !== undefined && changes.footer.ops !== "undefined") {
                    _settings.footer = changes.footer;
                }

                if (changes.sandbox !== undefined && typeof changes.sandbox === "boolean") {
                    _settings.sandbox = changes.sandbox;
                }

                if (changes.editorMode !== undefined && typeof changes.editorMode === "string") {
                    _settings.editorMode = changes.editorMode;
                }

                if (changes.traceOutput !== undefined && typeof changes.traceOutput === "boolean") {
                    _settings.traceOutput = changes.traceOutput;
                }

                if (changes.diary && typeof changes.diary.showEverybody === "boolean") {
                    _settings.diary.showEverybody = changes.diary.showEverybody;
                }

                if (changes.diary && Array.isArray(changes.diary.aliases)) {
                    _settings.diary.aliases = [];
                    changes.diary.aliases.forEach(alias => {
                        if (alias.trim().length) {
                            _settings.diary.aliases.push(alias);
                        }
                    });
                }

                this._patchBooleanSettings(_settings, changes, "general");
                this._patchBooleanSettings(_settings, changes, "tips");
            }
        });
    }

    public set username(val: string) {
        this._update((settings) => {
            settings.username = val;
        });
    }

    // public hideCommentEditor() {
    //     this._update((settings) => {
    //         settings.general.showCommentEditor.enabled = false;
    //     });
    // }

    // public showCommentEditor() {
    //     this._update((settings) => {
    //         settings.general.showCommentEditor.enabled = true;
    //     });
    // }

    // public toggleCommentEditor() {
    //     if (this.bs.value.general.showCommentEditor.enabled) {
    //         this.hideCommentEditor();
    //     } else {
    //         this.showCommentEditor();
    //     }
    // }

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


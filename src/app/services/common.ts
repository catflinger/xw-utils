import { Puzzle } from '../model/puzzle-model/puzzle';
import { QuillDelta } from '../model/puzzle-model/quill-delta';
import { environment } from 'src/environments/environment';

export const apiHosts = {
    primary: "crosswords.drurys.org",
    //secondary: "drurys2.org",
    development: "localhost:44301",
}

export function getApiRoot() {
    return environment.production ? 
        "/api/" :
        "https://" + apiHosts.development + "/api/";
} 

export enum ApiResponseStatus {
    OK = 0,
    other = 1,
    authorizationFailure = 2,
    apiDisabled = 3,
}

export interface ApiResponse {
    success: ApiResponseStatus,
    message: string;
}

export const AppResultSymbols = {
    OK: Symbol("OK"),
    AuthorizationFailure: Symbol("AuthorizationFailure"),
    Error: Symbol("Error"),
}

export type PublishStatus = "publish" | "draft";

export interface ContentGenerator {
    getContent(puzzle: Puzzle, gridUrl: string): string;
}

export type EditorMode = "modal" | "inline" | "fullscreen";
export const editorModes: ReadonlyArray<EditorMode> = ["modal", "inline", "fullscreen"];

export interface BooleanSetting {
    readonly caption: string
    readonly enabled: boolean;
}

// add new general settings here first, this will ensure all other missing additions are caught by the compiler
export interface GeneralSettings {
    //readonly showCommentEditor: BooleanSetting;
    readonly showCommentValidation: BooleanSetting;
    readonly showCheat: BooleanSetting;
    readonly containerFluid: BooleanSetting;
    readonly tabbedEditor: BooleanSetting;
}

// add new tip settings here first, this will ensure all other missing additions are caught by the compiler
export interface TipSettings {
    readonly general: BooleanSetting;
    readonly definitionWarning: BooleanSetting;
    readonly gridEditor: BooleanSetting;
    readonly gridEditorText: BooleanSetting;
    readonly gridStart: BooleanSetting;
    readonly specialText: BooleanSetting;
}

export interface DiarySettings {
    readonly showEverybody: boolean;
    readonly aliases: ReadonlyArray<string>;
}

export interface AppSettings {
    readonly username: string;
    readonly general: GeneralSettings;
    readonly tips: TipSettings;
    readonly footer: QuillDelta;
    readonly diary: DiarySettings;
    readonly sandbox: boolean;
    readonly editorMode: EditorMode;
    readonly traceOutput: boolean;
}

export type TipKey = keyof TipSettings;
export type GeneralKey = keyof GeneralSettings;
export type BooleanSettingsGroupKey = "general" | "tips";


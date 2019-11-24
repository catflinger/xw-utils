import { Puzzle } from '../model/puzzle';
import { ReadonlyQuillDelta } from '../model/interfaces';

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

export const ApiSymbols = {
    OK: Symbol("OK"),
    AuthorizationFailure: Symbol("AuthorizationFailure"),
    Error: Symbol("Error"),
}

export type PublishStatus = "publish" | "draft";

export interface ContentGenerator {
    getContent(puzzle: Puzzle, gridUrl: string): string;
}

export interface BooleanSetting {
    readonly caption: string
    readonly enabled: boolean;
}

// add new general settings here first, this will ensure all other missing additions are caught by the compiler
export interface GeneralSettings {
    readonly showCommentEditor: BooleanSetting;
    readonly showCommentValidation: BooleanSetting;
    readonly showCheat: BooleanSetting;
}

// add new tip settings here first, this will ensure all other missing additions are caught by the compiler
export interface TipSettings {
    readonly general: BooleanSetting;
    readonly definitionWarning: BooleanSetting;
    readonly gridEditor: BooleanSetting;
    readonly gridEditorText: BooleanSetting;
    readonly gridStart: BooleanSetting;
}

export interface DiarySettings {
    readonly showEverybody: boolean;
    readonly aliases: ReadonlyArray<string>;
}

export interface AppSettings {
    readonly username: string;
    readonly general: GeneralSettings;
    readonly tips: TipSettings;
    readonly sandbox: boolean;
    readonly footer: ReadonlyQuillDelta;
    readonly diary: DiarySettings;
}

export type TipKey = keyof TipSettings;
export type GeneralKey = keyof GeneralSettings;
export type BooleanSettingsGroupKey = "general" | "tips";


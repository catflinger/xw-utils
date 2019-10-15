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
    AuthorizationFailure: Symbol("AuthorizationFailure")
}


export interface TipSetting {
    //readonly key: TipKey;
    readonly caption: string
    readonly enabled: boolean;
}

export interface TipSettings {
    readonly general: TipSetting;
    readonly definitionWarning: TipSetting;
}

export interface AppSettings {
    readonly showCommentEditor: boolean;
    readonly username: string;
    readonly tips: TipSettings;
}
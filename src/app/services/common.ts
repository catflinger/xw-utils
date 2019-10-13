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

export type TipKey =  "general" | "definitionWarning";

export interface TipSetting {
    readonly key: TipKey;
    readonly enabled: boolean;
}

export interface AppSettings {
    readonly showCommentEditor: boolean;
    readonly username: string;
    readonly tips: ReadonlyArray<TipSetting>;
    tipIsEnabled(key: TipKey)
}
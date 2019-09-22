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
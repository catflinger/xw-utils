import { Puzzle } from '../model/puzzle';

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

export type PublishStatus = "draft";

export interface ContentGenerator {
    getContent(puzzle: Puzzle, gridUrl: string): string;
}

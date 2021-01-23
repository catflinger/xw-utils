import { Injectable } from '@angular/core';
import { Puzzle } from '../../model/puzzle-model/puzzle';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, ApiResponseStatus, ContentGenerator, PublishStatus, AppResultSymbols, getApiRoot } from '../common';
import { AuthService, Credentials } from '../app/auth.service';
import { AppSettingsService } from '../app/app-settings.service';
import { TableLayout } from '../content-generator/table-layout';
import { ListLayout } from '../content-generator/list-layout';

abstract class PublishPostResponse implements ApiResponse {
    public abstract success: ApiResponseStatus;
    public abstract message: string;
    public abstract wordpressId: number;
}

abstract class PublishGridResponse implements ApiResponse {
    public abstract success: ApiResponseStatus;
    public abstract message: string;
    public abstract wordpressId: number;
    public abstract url: string;
}

export interface PublishPostResult {
    readonly wordpressId: number;
}

export interface PublishGridResult {
    readonly wordpressId: number;
    readonly url: string;
}

@Injectable({
    providedIn: 'root'
})
export class PublicationService {

    constructor(
        private http: HttpClient,
        private authService: AuthService,
        private settingsService: AppSettingsService,
    ) { }

    // TO DO: IMPORTANT!
    // review this component for XSS vunerabilities

    public getContent(puzzle: Puzzle, gridUrl: string) {
        let generator: ContentGenerator= puzzle.publishOptions.layout === "list" ?
            new ListLayout():
            new TableLayout();

            return generator.getContent(puzzle, gridUrl);
    }

    public publishGrid(image: string, title: string): Promise<PublishGridResult> {
        const credentials: Credentials = this.authService.getCredentials();

        if (image) {
            return this.http.post(getApiRoot() + "PublishGrid", {
                title: title,
                content: image,
                username: credentials.username,
                password: credentials.password,
                sandbox: this.settingsService.settings.sandbox,
            })
            .toPromise()
            .then((data: PublishGridResponse) => {
                if (data.success === ApiResponseStatus.OK) {
                    return data as PublishGridResult;
                } else if (data.success === ApiResponseStatus.authorizationFailure) {
                    throw AppResultSymbols.AuthorizationFailure;
                } else {
                    throw "Publish Grid Failure: " + data.message;
                }
            });
        } else {
            return Promise.resolve(null);
        }
    }

    public publishPost(puzzle: Puzzle, gridUrl: string, status: PublishStatus): Promise<PublishPostResult> {
        const credentials: Credentials = this.authService.getCredentials();
        let content = this.getContent(puzzle, gridUrl);

        return this.http.post(getApiRoot() + "PublishPost", {
            provider: puzzle.info.provider,
            title: puzzle.info.title,
            content,
            username: credentials.username,
            password: credentials.password,
            status: status,
            sandbox: this.settingsService.settings.sandbox,
    })
        .toPromise()
        .then((data: PublishPostResponse) => {
            if (data.success === ApiResponseStatus.OK) {
                return data as PublishPostResult;
            } else if (data.success === ApiResponseStatus.authorizationFailure) {
                throw AppResultSymbols.AuthorizationFailure;
            } else {
                throw "Publish Post Failure: " + data.message;
            }
        });
    }
}

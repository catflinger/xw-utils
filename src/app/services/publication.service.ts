import { Injectable } from '@angular/core';
import { Puzzle } from '../model/puzzle';
import { HttpClient } from '@angular/common/http';
import { ContentGeneratorTableLayout } from './content-generator/content-generator-table-layout';
import { ApiResponse, ApiResponseStatus, ContentGenerator, PublishStatus } from './common';
import { AuthService, Credentials } from './auth.service';
import { environment } from 'src/environments/environment';
import { ContentGeneratorListLayout } from './content-generator/content-generator-list-layout';

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

@Injectable({
    providedIn: 'root'
})
export class PublicationService {

    constructor(
        private http: HttpClient,
        private authService: AuthService,
    ) { }

    // TO DO: IMPORTANT!
    // review this component for XSS vunerabilities


    public publishGrid(image: string, title: string): Promise<PublishGridResponse> {
        const credentials: Credentials = this.authService.getCredentials();

        if (image) {
            return this.http.post(environment.apiRoot + "PublishGrid", {
                title: title,
                content: image,
                username: credentials.username,
                password: credentials.password,
            })
            .toPromise()
            .then(data => data as PublishGridResponse)
        } else {
            return Promise.resolve(null);
        }
    }

    public publishPost(puzzle: Puzzle, gridUrl: string, status: PublishStatus): Promise<PublishPostResponse> {
        const credentials: Credentials = this.authService.getCredentials();

        let generator: ContentGenerator= puzzle.publishOptions.layout === "list" ?
            new ContentGeneratorListLayout():
            new ContentGeneratorTableLayout();
        
            let content = generator.getContent(puzzle, gridUrl);

        return this.http.post(environment.apiRoot + "PublishPost", {
            provider: puzzle.info.provider,
            title: puzzle.info.title,
            content,
            username: credentials.username,
            password: credentials.password,
            status: status,
    })
        .toPromise()
        .then(data => data as PublishPostResponse);
    }
}

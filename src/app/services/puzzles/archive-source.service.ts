import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, ApiResponseStatus, getApiRoot } from '../common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Archive } from '../../model/archive-model/archive';
import { PuzzleProvider } from '../../model/interfaces';

interface ArchiveItemResponse {
    setter: string;
    providerName: string;
    serialNumber: number;
    xwordDate: string;
}

interface ArchiveIndexResponse {
    provider: PuzzleProvider;
    items: ArchiveItemResponse[];
}

abstract class ArchiveResponse implements ApiResponse {
    public readonly success: ApiResponseStatus;
    public readonly message: string;
    public readonly indexes: ArchiveIndexResponse[];
}

@Injectable({
    providedIn: 'root'
})
export class ArchiveService {
    private bs: BehaviorSubject<Archive>;

    constructor(private http: HttpClient) {
        this.bs = new BehaviorSubject<Archive>(new Archive(null));
    }

    public observe(): Observable<Archive> {
        return this.bs.asObservable();
    }

    public getList(provider: PuzzleProvider): Promise<void> {

        return this.http.get(getApiRoot() + "archive/" + provider)
        .toPromise()
        .then((data: ArchiveResponse) => {
            if (data) {
                if (data.success === ApiResponseStatus.OK) {
                    this.bs.next(new Archive(data));
                } else {
                    throw data.message
                }
            }
        })
        .catch(e => { throw e.message; });
    }
}

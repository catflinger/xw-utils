import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiResponse, ApiResponseStatus } from './common';
import { BehaviorSubject, Observable } from 'rxjs';
import { Archive } from '../model/archive';
import { environment } from 'src/environments/environment';

interface ArchiveItemResponse {
    setter: string;
    providerName: string;
    serialNumber: number;
    xwordDate: string;
}

interface ArchiveIndexResponse {
    provider: string;
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

  public getList(provider: string): Promise<void> {

    return this.http.get(environment.apiRoot + "archive/" + provider)
      .toPromise()
      .then((data: ArchiveResponse) => {

        // console.log("LIST: " + JSON.stringify(data));

        if (data) {
              if (data.success === ApiResponseStatus.OK) {
                //let current = this.bs.value;

                // create a temporary writable archive
                // let archive = {
                //     indexes: []
                // };

                // copy across existing indexes
                // if (current) {
                //     current.indexes.forEach((index) => {
                //         if (index.provider !== provider) {
                //             archive.indexes.push(index);
                //         }
                //     });
                // }
                
                // refresh the requested index
                // data.indexes.forEach((index) => {
                //     if (index.provider === provider) {
                //         archive.indexes.push(new ArchiveIndex(index));
                //     }
                // });

                // publish a readonly version of the updated index
                this.bs.next(new Archive(data));
              }
          }
      })
      .catch(error => { throw error.message });
    }
}
import { Component, Output, EventEmitter, ViewChild, ElementRef, Input } from '@angular/core';
import { AppService } from '../app.service';

export interface DownloadInstance {
    download(filename: string, dataUrl: string): Promise<void>;
}

@Component({
    selector: 'app-download-button',
    templateUrl: './download-button.component.html',
    styleUrls: ['./download-button.component.css']
})
export class DownloadButtonComponent {
    public enabled: boolean;

    @Input() dataUrl: string;
    @Input() filename: string;
    @Output() download = new EventEmitter<any>()

    @ViewChild("downloadLink", { static: false }) downloadLink: ElementRef;

    constructor(private appService: AppService) { }

    public onClick() {
        new Promise<void>((resolve) => {
            this.downloadLink.nativeElement.click();
            resolve();
        })
        .then(() => this.download.emit(null))
        .catch((error) => this.download.emit(error))
    ;
    }
}

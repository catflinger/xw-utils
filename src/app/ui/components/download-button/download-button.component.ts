import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { AppService } from '../../services/app.service';

export interface DownloadInstance {
    download(filaneame: string, dataUrl: string): void;
}

@Component({
    selector: 'app-download-button',
    templateUrl: './download-button.component.html',
    styleUrls: ['./download-button.component.css']
})
export class DownloadButtonComponent implements AfterViewInit {
    public dataUrl: string;
    public filename: string;
    public enabled: boolean;

    @Output() download = new EventEmitter<DownloadInstance>();

    @ViewChild("downloadLink", { static: false }) downloadLink: ElementRef;

    constructor(private appService: AppService) { }

    public ngAfterViewInit() {
        setTimeout(()=> { this.enabled = typeof this.downloadLink.nativeElement.download !== "undefined"; }, 0);
    }

    public onClick(event: Event) {
        this.download.emit({
            download: (filename: string, dataUrl: string) => {
                this.dataUrl = dataUrl;
                this.filename = filename;
                setTimeout(() => this.downloadLink.nativeElement.click(), 0);
                this.appService.setAlert("info", "The image has been created.  Check the downloads folder in your browser.");
            }
        });
        event.preventDefault();
    }

}

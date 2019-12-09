import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService, OpenPuzzleParamters } from '../../services/app.service';
import { Router } from '@angular/router';
import { NavService } from '../../navigation/nav.service';
import { PublishingTrackData } from '../../navigation/tracks/publish-post-track';

@Component({
    selector: 'app-special-pdf',
    templateUrl: './special-pdf.component.html',
    styleUrls: ['./special-pdf.component.css']
})
export class SpecialPdfComponent implements OnInit {
    public form: FormGroup;

    private content: string = null;

    constructor(
        private navService: NavService,
        private appService: AppService,
    ) { }

    public ngOnInit() {
        this.appService.clear();
    }

    public onFileChange(files: any[]) {
        this.appService.clear();

        if (files && files.length) {
            let mimeType = files[0].type;

            if (mimeType.match(/pdf\/*/) === null) {
                this.appService.setAlert("danger", "Only pdf files are supported.");

            } else {
                let reader = new FileReader();
                reader.readAsBinaryString(files[0]);

                reader.onload = () => {
                    this.content = btoa(reader.result as string);
                }
            }
        }
    }

    public onOpenPdf() {
        this.appService.clear();
        this.appService.setOpenPuzzleParams({ provider: "pdf", sourceDataB64: this.content });
        this.navService.beginTrack({
            track: "publish-post", 
            data: new PublishingTrackData(null)
        });
    }
}

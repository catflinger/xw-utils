import { Component, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { AppService, OpenPuzzleParamters } from '../../services/app.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-special-pdf',
    templateUrl: './special-pdf.component.html',
    styleUrls: ['./special-pdf.component.css']
})
export class SpecialPdfComponent implements OnInit {
    public form: FormGroup;

    private content: string = null;

    constructor(
        private appService: AppService,
        private router: Router,
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
        this.appService.setOpenPuzzleParams(new OpenPuzzleParamters(null, this.content));
        this.router.navigate(["open-puzzle"]);
    }
}

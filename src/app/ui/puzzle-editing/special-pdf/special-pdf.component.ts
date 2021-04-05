import { Component, OnInit, AfterViewInit, ChangeDetectionStrategy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppService } from '../../general/app.service';
import { NavService } from '../../../services/navigation/nav.service';
import { AppTrackData } from '../../../services/navigation/tracks/app-track-data';
import bsCustomFileInput from "bs-custom-file-input";
import { ProvisionOptions } from '../provision-options-control/provision-options-control.component';

@Component({
    selector: 'app-special-pdf',
    templateUrl: './special-pdf.component.html',
    styleUrls: ['./special-pdf.component.css'],
})
export class SpecialPdfComponent implements OnInit, AfterViewInit {
    public form: FormGroup;

    private content: string = null;

    constructor(
        private navService: NavService<AppTrackData>,
        private appService: AppService,
        private formBuilder: FormBuilder,
    ) { 
    }


    public ngOnInit() {

        this.form = this.formBuilder.group({
            file: [],
            gridPage: [1, Validators.required],
            textPage: [1, Validators.required],
            provisionOptions: null,
            advancedOptions: false,
        });

        //this.appService.clear();
    }

    public ngAfterViewInit() {
        bsCustomFileInput.init();
    }

    public onFileChange(files: FileList) {
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
        this.appService.setOpenPuzzleParams({ 
            provider: "pdf", 
            sourceDataB64: this.content,
            gridPage: parseInt(this.form.value.gridPage),
            textPage: parseInt(this.form.value.textPage),
            provisionOptions: this.form.value.provisionOptions,
         })
        this.navService.navigate("continue");
    }
}

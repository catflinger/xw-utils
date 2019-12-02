import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextParsingService } from 'src/app/services/parsing/text/text-parsing-service';
import { ParseData } from 'src/app/services/parsing/text/parse-data';
import { IParseContext, ParseContext } from 'src/app/services/parsing/text/text-parsing-context';

const defaultText: string = "ACROSS\n1 This is an across clue (5)\nDOWN\n2 This is a down clue (7)";

@Component({
    selector: 'app-special-text',
    templateUrl: './special-text.component.html',
    styleUrls: ['./special-text.component.css']
})
export class SpecialTextComponent implements OnInit {
    public form: FormGroup;
    public parseResult: IParseContext = null;

    constructor(
        private appService: AppService,
        private textParsingService: TextParsingService,
        private router: Router,
        private fb: FormBuilder,
    ) { }

    public ngOnInit() {
        this.form = this.fb.group({
            title: ["", Validators.required],
            text: [defaultText, Validators.required],
        });
    }

    public onContinue() {
        this.appService.clear();
        try {
            this.parseResult = this.openSpecialText(this.form.value.text);
        } catch(error) {
            this.appService.setAlert("danger", "ERROR :" + error.message)
        }

        //this.appService.setOpenPuzzleParams({ provider: "text", sourceText: this.form.value.text, title: this.form.value.title });
        //this.router.navigate(["open-puzzle"]);
    }

    public onCancel() {
        this.router.navigate(["/home"]);
    }

    public onKeyDown(event: KeyboardEvent) {
        // to stop errors from LastPass and other add-ons that attach listeners 
        // to this control
        event.stopPropagation();
    }

    private openSpecialText(text: string): IParseContext {
        let parseData = new ParseData();
        parseData.clueDataType = "text";
        parseData.rawData = text;

        let parser = this.textParsingService.parser(parseData, null);
        let context = parser.next();
    
        while(!context.done) {
            context = parser.next();
        }
    
        return context.value as IParseContext;
    }

}

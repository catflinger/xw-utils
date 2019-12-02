import { v4 as uuid } from "uuid";
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TextParsingService } from 'src/app/services/parsing/text/text-parsing-service';
import { ParseData } from 'src/app/services/parsing/text/parse-data';
import { IParseContext } from 'src/app/services/parsing/text/text-parsing-context';
import { Puzzle } from 'src/app/model/puzzle';
import { QuillDelta } from 'src/app/model/interfaces';
import { IPuzzleManager } from 'src/app/services/puzzle-management.service';

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
        private puzzleManager: IPuzzleManager,
        private router: Router,
        private fb: FormBuilder,
    ) { }

    public ngOnInit() {
        this.form = this.fb.group({
            title: ["", Validators.required],
            text: [defaultText, Validators.required],

            // TO DO: add a field for the setter
        });
    }

    public onParse() {
        this.appService.clear();
        try {
            this.parseResult = this.openSpecialText(this.form.value.text);

            if (!this.parseResult.error) {
                this.puzzleManager.addPuzzle(this.createNewPuzzle());
                this.router.navigate(["blogger"]);
            }
        } catch(error) {
            this.appService.setAlert("danger", "ERROR :" + error.message)
        }
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

    private createNewPuzzle(): Puzzle {
        return new Puzzle({
            clues: this.parseResult.clues,
            info: {
                id: uuid(),
                title: this.form.value.title,
                puzzleDate: new Date().toISOString(),
                provider: "text",
                setter: "anon", 
                wordpressId: null,
                blogable: true,
                solveable: false,
                gridable: false
            },
            notes: {
                header: new QuillDelta(),
                body: new QuillDelta(),
                footer: new QuillDelta(),
            },
            publishOptions: {
                clueStyle: {
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                },
                answerStyle: {
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                },
                definitionStyle: {
                    color: "#000000",
                    bold: false,
                    italic: false,
                    underline: false,
                },
                includeGrid: false,
                layout: "table",
                spacing: "small",
            },
        });
    }
}

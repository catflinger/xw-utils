import { ValidatorFn, Validators } from "@angular/forms";
import { CaptionStyle } from "src/app/model/interfaces";
import { clueCaptionExpression, clueLetterCountExpression } from "src/app/services/parsing/text/types";

export class ClueValidators {
    
    public static getCaptionValidators(captionStyle: CaptionStyle): ValidatorFn[] {
        let validators: ValidatorFn[] = [];

        if (captionStyle === "alphabetical") {
            validators.push(Validators.required);
            validators.push(Validators.pattern(String.raw`^\s*[A-Z]\s*$`));
    
        } else if (captionStyle === "numbered") {
            validators.push(Validators.required);
            validators.push(Validators.pattern(clueCaptionExpression + String.raw`\s*$`));
        }
        return validators;
    }
    
    public static getTextValidators(hasLetterCount: boolean): ValidatorFn[] {
        let validators: ValidatorFn[] = [];

        if (hasLetterCount) {
            validators.push(Validators.required);
            validators.push(Validators.pattern(String.raw`^.*` + clueLetterCountExpression));
        } else {
            validators.push(Validators.required);
        }

        return validators;
    }
}
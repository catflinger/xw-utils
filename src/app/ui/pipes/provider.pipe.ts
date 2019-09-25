import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'provider', pure: false })
export class ProviderPipe implements PipeTransform {
    constructor() {
    }

    transform(content: string) {
        let result: string = content;

        switch (content) {
            case "ft":
            case "ftb":
                result = "Financial Times";
                break;
            case "cryptic":
                result = "Guardian";
                break;
            case "prize":
                result = "Guardian Prize";
                break;
            case "quiptic":
                result = "Guardian Prize";
                break;
            case "independent":
                result = "Independent";
                break;
            case "ios":
                result = "Independent on Sunday";
                break;
            case "everyman":
                result = "Everyman";
                break;
            case "azed":
                result = "Azed";
                break;
        };

        return result;
    }
}
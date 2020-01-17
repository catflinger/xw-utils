import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class ProviderService {

    constructor() { }

    getProviderString(provider: string): string {
        let result: string;

        switch (provider) {
            case "ft":
                result = "Financial Times";
                break;
            case "cryptic":
                result = "Guardian";
                break;
            case "prize":
                result = "Guardian Prize";
                break;
            case "quiptic":
                result = "Quiptic";
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
            default:
                result = provider;
                break;
        };

        return result;
    }
}
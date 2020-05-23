import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';

@Injectable({
    providedIn: 'root'
})
export class TraceService {

    constructor(private settingsService: AppSettingsService) { 
    }

    public log(item: any): void {
        if (this.settingsService.settings.traceOutput) {
            console.log(item);
        }
    }

    public logJason(item: any): void {
        if (this.settingsService.settings.traceOutput) {
            console.log(JSON.stringify(item, null, 2));
        }
    }

}

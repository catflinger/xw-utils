import { Injectable } from '@angular/core';
import { AppSettingsService } from './app-settings.service';

@Injectable({
    providedIn: 'root'
})
export class TraceService {

    private traceItems: string[] = [];

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

    public clearTrace() {
        if (this.settingsService.settings.traceOutput) {
            this.traceItems = [];
        }
    }

    public addTrace(message: string) {
        if (this.settingsService.settings.traceOutput) {
            this.traceItems.push(message);
        }
    }

    public getTrace(): ReadonlyArray<string> {
        return this.traceItems;
    }
}

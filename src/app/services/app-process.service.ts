import { Injectable } from '@angular/core';
import { NavProcessor } from '../ui/navigation/interfaces';
import { AppTrackData } from '../ui/navigation/tracks/app-track-data';

@Injectable({
  providedIn: 'root'
})
export class AppProcessService implements NavProcessor<AppTrackData> {

    exec(processName: string, appData: AppTrackData): string {
        let action: string = null;

        switch(processName) {
            case "abc":
                action = "xyz";
                break;

            default:
                throw "Could not find navivgation process with name " + processName;
        }

        return action;
    }

  constructor() { }

}

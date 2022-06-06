import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { AppSettingsService } from 'src/app/services/app/app-settings.service';
import { Subscription } from 'rxjs';
import { AppService } from 'src/app/ui/general/app.service';
import { AppSettings } from 'src/app/services/common';
import { DiaryAliasEvent } from '../diary-alias-control/diary-alias-control.component';

class AliasControl {
    constructor(
        public text: string,
        public editable: boolean,
        public id: number,
    ){}
}

@Component({
  selector: 'app-diary-settings-editor',
  templateUrl: './diary-settings-editor.component.html',
  styleUrls: ['./diary-settings-editor.component.css']
})
export class DiarySettingsEditorComponent implements OnInit, OnDestroy {
    public settings: AppSettings;
    public aliasControls: AliasControl[] = [];
    public checked: boolean;

    private subs: Subscription[] = [];

    constructor(
        private appService: AppService,
        private settingsService: AppSettingsService,
    ) { }

    ngOnInit() {

        this.settings = this.settingsService.settings;

        this.subs.push(this.settingsService.observe().subscribe(settings => {
            this.settings = settings;
            this.aliasControls = [];
            this.settings.diary.aliases.forEach((alias, index) => this.aliasControls.push(new AliasControl(alias, false, index)));
            this.checked = settings.diary.showEverybody;
        }));

    }

    public ngOnDestroy() {
        this.subs.forEach(sub => sub.unsubscribe());
    }

    public onShowEverybodyChange() {
        this.checked = !this.checked;
        this.save();
    }

    public onAddAlias() {
        this.aliasControls.push(new AliasControl("", true, this.aliasControls.length));
    }

    public onRemoveAlias(event: DiaryAliasEvent) {
        this.aliasControls.splice(event.id, 1);
        this.save();
    }

    public onSaveAlias(event: DiaryAliasEvent) {
        this.aliasControls[event.id].text = event.text;
        this.save();
    }

    private save() {
        let aliases = [];
        this.aliasControls.forEach(control => aliases.push(control.text));

        let changes = {
            diary: { 
                showEverybody: this.checked,
                aliases: aliases,
            },
        }

        this.settingsService.update(changes);
    }

}

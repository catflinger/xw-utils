import { Injectable, OnDestroy } from '@angular/core';
import { v4 as uuid } from "uuid";
import { BehaviorSubject, Observable } from 'rxjs';

interface IEditorInstance {
    id: string,
    save: () => Promise<boolean>,
}

@Injectable({
    providedIn: 'root'
})
export class ClueEditorService {
    private currentInstance: IEditorInstance = null;
    private bsSelectedClue = new BehaviorSubject<string>(null);

    constructor() {
    }

    public observe(): Observable<string> {
        return this.bsSelectedClue.asObservable();
    }

    public setSelectedClue(clueId): void {
        this.bsSelectedClue.next(clueId);
    }

    public clearSelection() {
        this.setSelectedClue(null);
    }

    public register(save: () => Promise<boolean>): string {
        const id = uuid();
        this.currentInstance = {id, save };
        return id;
    }

    public unRegister(id: string) {
        const current = this.currentInstance;

        if (current && id && current.id === id) {
            this.currentInstance.save = null;
            this.currentInstance = null;
        }
    }

    public get isActive(): boolean {
        return this.currentInstance !== null;
    }

    public save(): Promise<boolean> {
        if (this.currentInstance) {
            return this.currentInstance.save()
            .then((cancel) => {
                if (!cancel) {
                    this.currentInstance = null;
                }
                return cancel;
            });
        } else {
            return Promise.resolve(false);
        }
    }
}

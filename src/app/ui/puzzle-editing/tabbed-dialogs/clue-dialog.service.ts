import { Injectable, OnDestroy } from '@angular/core';
import { v4 as uuid } from "uuid";

interface IEditorInstance {
    id: string,
    save: () => Promise<boolean>,
}

class LastKeypress {
    private last: string = null;

    public put(key: string): void {
        this.last = key;
    };
    public take(): string {
        const key = this.last;
        this.last = null;
        return key;
    };
    public clear(): void
    {
        this.last = null;
    }
}

@Injectable({
    providedIn: 'root'
})
export class ClueDialogService {
    private currentInstance: IEditorInstance = null;

    public readonly lastKeyPress: LastKeypress;

    constructor() {
        this.lastKeyPress = new LastKeypress();
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

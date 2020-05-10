export type BackupType = "puzzle" | "setttings";
export type BackupContentType = "json";

export class BackupInfo {
    readonly id: string;
    readonly owner: string;
    readonly origin: string;
    readonly caption: string;
    readonly date: Date;
    readonly backupType: BackupType;
    readonly contentType: BackupContentType;
    readonly content?: string;

    constructor(data: any) {
        this.id = data.id;
        this.owner = data.owner;
        this.origin = data.origin;
        this.caption = data.caption;
        this.backupType = data.backupType;
        this.contentType = data.contentType;
        this.date = new Date(data.date);
        this.content = data.content;
    }
}
export class BackupInfo {
    readonly id: string;
    readonly owner: string;
    readonly origin: string;
    readonly caption: string;
    readonly date: Date;
    readonly contentType: string;
    //content: string;

    constructor(data: any) {
        this.id = data.id;
        this.owner = data.owner;
        this.origin = data.origin;
        this.caption = data.caption;
        this.contentType = data.contentType;
        this.date = new Date(data.date);
    }
}
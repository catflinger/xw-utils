import moment from "moment";

export class ArchiveItem {
    public readonly provider: string;
    public readonly serialNumber: number;
    public readonly date: Date;
    public readonly setter: string;
    public readonly url: string;

    constructor(data: any) {
        this.provider = data.provider;
        this.serialNumber = data.serialNumber;
        this.date = moment(data.xwordDate).toDate();
        this.setter = data.setter;
        this.url = data.url;
    }
}
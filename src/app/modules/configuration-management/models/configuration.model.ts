export class Configuration {
    KeyID: number;
    KeyName: string;
    Description: string;
    KeyValue: string;
    KeyValueClob: string;
    Type: string;
    IsParent: string;
    ParentID: string;

    clear() {
        this.KeyName = '';
        this.KeyValue = '';
    }

}

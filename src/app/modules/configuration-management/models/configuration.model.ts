export class Configuration {
    KeyID: number;
    KeyName: string;
    Description: string;
    KeyValue: string;
    KeyValueClob: string;
    Type: string;
    IsParent: string;
    ParentID: string;
    Purpose: string;

    clear() {
        this.KeyName = '';
        this.KeyValue = '';
    }

}

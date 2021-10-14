export class DocumentTypeModel {
    Id: number;
    Name: string;
    NoOfPages: string;

    clear() {
        this.Id = 0;
        this.Name = '';
        this.NoOfPages = '';
    }
}

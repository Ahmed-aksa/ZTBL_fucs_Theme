export class SubmitDocument {
    document_type_id: number;
    description: string = "";
    reference: string = "";
    cnic: string;
    number_of_files: number;
    CustomerDocuments: [{
        "Description": string;
        "PageNumber": string;
        "FilePath": File;
    }]

}

export class LoanUtilization {

    Zone: string;
    Branch: string;
    // CustomerName:string;
    // FatherName:string;
    // Cnic:string;

    // clear() {
    //   this.CustomerName = "";
    //   this.FatherName = "";
    //   this.Cnic = "";
    // }

}

export class LoanUtilizationModel {
    ID:string;
    LoanCaseNo:string;
    LoanDisbID:string;
    Lat:string;
    Lng:string;
    Status:string;
    Remarks:string;
    CircleId:string;
}

export class UtilizationFiles
{
    UtilizationID: number;
    ID: number;
    ImageFilePath: string;
    VideoFilePath:string;
    Lng: string;
    Lat: string;
    file:File;
    IsVideo:boolean;
}

export class LoanUtilizationSearch
{
}




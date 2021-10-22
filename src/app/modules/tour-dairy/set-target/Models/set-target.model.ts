// export class DeceasedCustomer {
//     Customer: Customer[] = [];
// }


// export class Customer {
//     CustomerName:string;
//     Cnic:string;
//     FatherName:string;
//     CustomerStatus:string;
// }

export class SetTarget{
    // CustomerCnic:number;
    // PPNo:number;
    // UserID:number;
    // BranchID:number;
    // NadraNo:number;
    // IsNadraCertificateVerified:string;
    // DateOfDeath:string;
    // Remarks:string;
    // OtherSourceOfIncome:string;
    // LegalHeirPay:string;
    // File:any;
    // DeceasedID:number;
    status:number;
}

// export class Target {
//     firstName: string;
//     lastName: string;
//     age: number;
//     gender: string;
// }

export class Documents {
    ZoneId: number;
    BranchID: number;
    LoanType: string;
    LoanStatus: string;
    DocumentId: number;
    Description: string;
    PageNumber: number;
    DocumentRefNo: string;
    DocumentNumber: number;
    DocumentType: string;
    OwnerName: string;
    LoanCaseID: number;
    ParentDocId: number;
    CreatedUpdatedBy: number;
    EnteredBy: number;
    file: any;
    DocLoanId: string;
  }
export class Loan {
    ApplicationHeader: LoanApplicationHeader
    LoanApplicationpurpose: LoanApplicationPurpose
    CustomersLoanLands: CustomersLoanLand[] = [];
    LoanSecurities: LoanSecurities;
    CustomersLoanApp: CustomersLoanApp;
    CustomersLoanList: CustomersLoanApp[] = [];
    LoanApplicationLegalHeirs: LoanApplicationLegalHeirs;
    PersonalSureties: PersonalSureties;
    CorporateSurety: CorporateSurety;
    LoanRefrences: LoanRefrences;
    LoanWitness: LoanWitness;
    LoanPastPaid: LoanPastPaid;
    LoanDocumentCheckList: LoanDocumentCheckList[] = [];
    CurrentLoans: CurrentLoans;
    GlConfigrationsDetail: GlConfigrationsDetail;
    CropProduction: CropProduction;
    AppraisalProposedList: AppraisalProposed[] = [];
    AppraisalProposed: AppraisalProposed;
    TranId: number;
    LcNo: string;
    Status: string;
    Appdt: string;
    ORR: ORR;
    DBR: object;
    MakeReschedule: MakeReschedule;
    ReschedulingList: ReschedulingList[] = []
}

export class MakeReschedule {
    SchemeCode: number;
    CropCode: string;
    LoanReschID: number;
    LoanReshID: number;
    OrgUnitID: number;             // login user branch id
    LoanAppID: number;
    LoanAppSanctionID: number;             // Sub Proposal
    LoanDisbID: number;             // Disbursement
    ProposalID: number;             // Grace Days(Ist Installment)
    SubProposalID: number;
    GlSubID: number;
    Status: number;              // on save it will be 1
    EnteredBy: string;
    EnteredDate: string;                    // system date
    Remarks: string;                     //    Remarks
    AmountPayableForReschPer: number;                    // Down Payment (%)
    RescheduleTypeID: number;                    // Resch Type
    IstInstallmentDefferDays: number;                     // Grace Days(Ist Installment)
    OutSDMarkupWithIstInstPer: number;                    // Mark-UP Installment (%)
    LoanAppsanctionIDNew: number;
    LoanDisbIDNew: number;
    ProposalIDNew: number;
    SubProposalIDNew: number;
    GlSubIDNew: number;                    // New GL Code
    LoanCaseNO: string;
}


export class ReschedulingList {
    LoanAppID: number;
    LoanDisbID: number;
    GraceMonths: number;
    RequestCategory: number;
    RequestStatus: number;
    ManagerPPNo: number;
    McoPPNO: number;
    Cnic: string;
    EffectiveReqDate: string;
    UserId: string;
    CustomerID: string;
    BranchId: string;
    Remarks: string;
    BranchCode: string;
    LoanCaseNo: string;
    GlSubCode: string;
    OsPrin: number;
    OsMarkup: number;
    DisbStatusID: number;
    CustomerName: string;
    FatherName: string;
    PermanentAddress: string;
    GlSubname: string;
    MajorBorrower: string;
    GlSubID: number;
    UserID: string;
    BranchID: string;
    ID: string;
}

export class ORR {
    LoanAppID: number;
}

export class LoanApplicationHeader {
    ZoneId: number;
    BranchID: number;
    AppDate: string;
    DevProdFlag: string; //LoanType
    DevAmount: number;
    ProdAmount: number;
    LoanCaseNo: string; //Lc Old No
    //BookletNo: string;
    CategoryID: string;// Loan Category
    //LcNoAuto: string;
    CircleID: string;//Circle
    RefDepositAcc: string;//DepositAcc
    ApplicantionTitle: string = ""; //ReferenceNumber

    // extra
    LoanAutoNo: string = "";
    LoanAppID: number = 0;
    ManagerComments: string = "";
    AppNumberManual: string = "";
    IsAbove1Million: string = "N";
    CreatedOn: string;
    AppStatus: number = 1;
    MCORemarks: string = "";
    AppBusProposalID: number = 0;
    AppBusSubProposalID: number = 0;
}


export class CustomersLoanLand {
    ID: number;
    LoanAppID: number;
    LandInfoID: number;
    PassbookNo: string;
    TotalArea: string;
    OwnAreaAddress: string;
    TypeFla: string;
    CustomerID: string;
    LandTypeFlag: string;
    AttachedFlag: string;
    BranchID: number;
    ChargeCreationID: number;
    Status: string;
    IsRedeem: string;

}

export class LoanApplicationPurpose {
    FundNonFund: string;
    BwrAgreeInsurancePrem: string;
    MarkupCalcMode: number;
    CropID: number;
    CultivatedArea: number;
    Unit: number;
    NecessitiesDetail: string;
    TotalEstimatedCost: number;
    Quantity: number;
    AmountInHand: number;
    AmountRequired: number;
    LoanAppID: number;
    RequiredItem: number;
    GlSubID: number;
    DevProdID: number;
    SchemeID: number;


    //GLCode: string;
    //CropCode: string;
    //SchemeCode: number;
    //CultivatedArea: number;
    //MarkupCalc: string;
    //Capacity: string;
    //Quantity: string;
    //Facility: string;

    //MarketPrice: number;
    //Equity: number;
    //LoanApplied: number;
    //Remarks: string;
}


export class LoanSecurities {
    CollTypeID: number;
    QuantityUnit: number;
    Remarks: string;
    BasisofMutation: string;
    UnitPrice: number;
    AppSecurityID: number;
    LoanAppID: number;
    PludgedValue: number;
    MaxCreditLimit: number;
    Quantity: number;
    EnteredDate: string;
    EnteredBy: string;
    SecurityType: string;
    OrgUnitID: string;
}

// By Adnan
export class LoanApplicationLegalHeirs {
    UserID: string;
    LegalHeirsName: string;
    PhoneRes: string;
    PhoneOff: string;
    PhoneCell: string;
    Cnic: string;
    Dob: string;
    DobTxt: string;
    Gender: string;
    RelationID: number;
    RelationName: string;
    LoanAppID: number;
    CustomerID: string;
    CustomerName: string;
    ID: string
}


export class PersonalSureties {
    PersonalSuretyID: number;
    FullName: string;
    Percentage: string;
    Address: string;
    AccountNo: string;
    SourceofIncome: string;
    AnnualIncome: number;
    AssetValue: number;
    PresentDues: number;
    NetValue: number;
    LoanAppID: number;
    Cnic: string;
    Phone: string;
    SrNo: number;
}

export class CorporateSurety {
    CompanyName: string;
    MemorandumDate: string;
    RefrenceNo: string;
    SrNo: number;
    CorporateSuretyID: number;
    LoanAppID: number;
}

export class CorporateSuret {
    CompanyName: string;
    MemorandumDate: string;
    RefrenceNo: string;
    SrNo: number;
    CorporateSuretyID: number;
}

export class LoanRefrences {
    ReferenceID: number;
    Name: string;
    Address: string;
    LoanAppID: number;
    Cnic: string;
    Phone: string;
    SrNo: number;
    Ntn: string;
    Fax: string;
    Email: string;
}

export class LoanWitness {
    WitnessesID: number;
    LoanAppID: number;
    SrNo: number;
    Cnic: string;
    WitnessName: string;
    WitnessAddress: string;
    branchId: string;
}

export class LoanPastPaid {
    PaidLoanID: number;
    BankName: string;
    AmountToPaid: number;
    DueDate: string;
    LastPaidDate: string;
    LoanAppID: number;
}


export class LoanDocumentCheckList {
    AppDocID: number;
    ChecklistID: number;
    LoanAppID: number;
}


export class CurrentLoans {
    FundNonfundFlag: string;
    CurrentLoanID: number;
    BankName: string;
    TotalDebit: number;
    GurenteeDetail: string;
    DateDebitAcheive: string;
    AmountToPaid: number;
    DueDate: string;
    PurposeID: number;
    LoanAppID: number;
    BranchID: number;
    Status: string;
    PurposeDetail: string;
}

export class CustomersLoanApp {
    CustLoanAppID: number;
    Cnic: string;
    RelationID: number;
    LoanAppID: number;
    Agps: string;
    CustomerName: string;
}

export class GlConfigrationsDetail {
    SchemeCode: string;
    GLCode: string;
    CropCode: string;
}

export class CropProduction {
    ItemDetailID: number;
    CropID: number;
    Area: string;
    TotalOutput: number;
    Price: number;
    LoanAppID: number
    ExpPrec: string;
    AppraisalType: string;
    Remarks: string;

}

export class AppraisalProposed {
    ItemID: number;
    CmAppraisalID: number;
    FirstEntry: number;
    LandUncultivaed: string;
    LandNotCultivated: string;
    FutureValue: number;
    PresentValue: number;
    LoanAppID: number;
    Remarks: string;
}


export class LoanDocuments {
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

export class SearchLoan {
    ZoneId: string;
    BranchId: string;
    LcNo: string;
    AppNo: string;
    Appdt: string;
    Status: string;
}

export class LoanDbr {
    DBRIncomeList: any;
    DBRLiabilitiesList: any;
    LoanAppID: number;
}

class DBRIncome {
    value: string;
    id: string;
    itemName: string;
    itemCode: string;
    itemType: string;
    active: string;
}

export class SearchLoanDbr {
    ZoneId: string;
    BranchId: string;
    LoanAppID: number;
}

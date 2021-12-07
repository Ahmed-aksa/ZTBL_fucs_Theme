export class JournalVoucherModel {
    Type: string;
    Lcno: string;
    VouchNo: string;
    Status: string;
    Appdte: string;
    InstNo: string;
    CurrentIndex: number;
    Count: number;
    SbsFLag: boolean;
    WorkingDate: string;
    LnTransactionID: string;


    JvMasterCodes: JvMasterCodes;
    JvMasterCodesList: JvMasterCodes[];

    JournalVocherData: JournalVocherData;
    JournalVocherDataList: JournalVocherData[];

    GLforJV: GLforJV;
    GLforJVList: GLforJV[];
}

export class JvMasterCodes {
    JvCategory: number;
    Code: string;

    TrMasterID: string;
    TrMasterCode: string;
    Description: string;
    TransactionNatureID: string;
    IsActive: string;
    EffectiveFrom: string;
    ValidUntil: string;
    AclCode: number;

}

export class JournalVocherData {
    OrgUnitID: number;
    UserBranchID: number;
    WorkingDateTransDate: string;
    ManualVoucherNo: number;
    TransactionMasterID: number;
    EffectiveDate: string;
    Nature: string;
    DrAmount: number;
    CRAMOUNT: number;
    TrCode: string;
    RoCode: string;
    AdviceNo: string;
    ContraBranchID: string;
    OrgDeptID: string;
    LoanCaseID: string;
    LoanDisbID: string;
    DepositAccID: string;
    ContraVoucherNo: string;
    RecordNo: string;
    CaCode: string;
    InstrumentType: string;
    Prefix: string;
    DdPono: string;
    EmpPPNo: string;
    TransactionMasterCode: string;
    PayeeOrgUnitID: string;
    PayeeName: string;
    PayeeCNIC: string;
    Note: string;
    Samlc: string;
    Glsam: string;
    TrMasterIDJv: string;
    MakerID: string;
    IpAddress: string;
    IsAutoVoucher: string;
    TransactionStatus: string;
    TransactionFlag: string;
    TransactionCode: string;
    TransactionID: string;
    ParentTransactionID: string;
    InstrumnetNo: string;
    AccountID: string;
    LoanSanctionID: string;
    TransactionType: string;
    LoanCaseNo: string;
    Remarks: string;
    TransactionDetailID: string;
    GlSubID: string;
    GlSubCode: string;
    GlSubName: string;
    AccountNo: string;
    MasterDesc: string;
    ContraBranchCode: string;
    ContarDeptCode: string;
    ParentDetailID: string;
    PayeeOrgCode: string;
    DdNumber: string;
    PoNumber: string;
    RespMcodeCode: string;
    Calceffect: string;
    DeductionID: string;
    DetNote: string;
    DetNote1: string;
    MapedWithDetailID: number;
    TransactionSeq: string;
    TransactionDate: string;
    Offset: string;
    Limit: string;
}

export class GLforJV {
    LCNo: string;
    DisbDesc: string;
    LoanDisbID: string;
}

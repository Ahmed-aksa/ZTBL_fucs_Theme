
export enum RecoveryTypes {
  Recovery = 1,
  InterBranchRecovery = 2,
  SBSRecovery = 3,
  SBSInterBranchRecovery = 4
}

export class RecoveryModel {
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


  SubProposalGL: SubProposalGLModel;
  SubProposalGLList: SubProposalGLModel[];
  DisbursementGL: DisbursementGLModel;
  RecoveryData: RecoveryDataModel;
  DisbursementGLList: DisbursementGLModel[];
  AccountDetailList: AccountDetailModel[];
  MasterCodesList: MasterCodes[];
  RecoveryLoanTransaction: RecoveryLoanTransaction[];
  DrCrDetailList: DrCrDetail[];
  Customers: RecoveryCustomer[];
}

export class SubProposalGLModel {
  LoanAppSanctionID: number;
  ProdDevID: number;
  CadLimit: number;
  SanctionedAmount: number;
  TotalDisbursement: number;
  RecoveredPrincipal: number;
  SbsProductCode: number;
  GlSubName: string;
  Description: string;
  GlSubID: number;
  ProposalID: number;
  SubProposalID: number;
  GlSubID1: number;
  BranchId: number;
  LoanAppID: number;
  LoanCaseNo: string;
  Active: string;
  Authstatus: string;
}

export class DisbursementGLModel {
  SanctionID: number;
  AutoNumber: number;
  Description: string;
  LoanDisbID: number;
  GlSubCode: string;
  SchemeCode: string;
  CropCode: string;
  ValidUntil: string;
  FirstSanctionedAmount: string;
  RecoveredPrincipal: string;
  DisbursedAmount: number;
}

export class AccountDetailModel {
  SanctionedAmount: number;
  OutstandPrincipal: string;
  OutstandMrk: number;
  EcreditGobMrk: string;
  PD: string;
  CD: string;
  TotalOutstand: string;
  LastRecoveryDate: string;
  NewNextDueDate: string;
  DueAmount: number;
  DespositAccount: string;
  GlSubCode: string;
  CustomerName: string;
  Status: string;
  SamOpeningDate: string;
  SamMarkup: string;
  SamTotalOS: string;
  SamCofOS: string;
  LegalChargesRecieable: string;
  IsDeceased: string;
}

export class MasterCodes {
  AutoNumber: number;
  LnTransactionMasterID: number;
  LnTransactionMasterCode: string;
  Description: string;
  TrID: number;
  ChequeReq: string;
  AmountType: string;
  VoucherReq: string;
  DepsLipReq: string;
}

export class RecoveryDataModel {

  LfNumber : string;
  TranDate : string;
  RecoveryThroughType: string;
  LnAccountID: string;
  RecoveryType: string;
  ContraBranchCode: string;
  TrCode: string;
  IpAddress: string;
  TransactionType: string;
  Amount: string;
  UserID: string;
  MakerID: string;
  TransactionID: string;
  TransactionCode: string;
  MasterTrCode: string;
  InstrumentNO: string;
  LoanCaseNo: string;
  EffectiveDate: string;
  SubProposalID: number;
  LoanSanctionID: string;
  InstrumentType: string;
  TransactionStatus: string;
  VoucherNo: string;
  CoordinatorID: string;
  TransactionFlag: string;
  OrgUnitid: number;
  UserBranchID: number;
  Remarks: string;
  BranchWorkingDate: string;
  DisbursementID: number;
  ReceiptNo: string;
  BookNo: string;
  SamRecoveryType: string;
  CircleID: string;
}

export class RecoveryLoanTransaction {
  TransactionID: string;
  DrAmount: number;
  CrAmount: number;
  Remarks: string;
  TrCode: string;
  LnTransactionMasterID: string;
  MakerID: string;
  InstrumentNO: string;
  VoucherNo: string;
  LoanCaseNo: number;
  UserBranchID: number;
  UserBranchName: string;
  EffectiveDate: string;
  BranchWorkingDate: string;
  TransactionStatus: string;
  AccountTransactionSeq: number;
  DisbursementID: number;
  SbsRecID: number;
  StatusName: string;
  CreatedOn: string;
  TransactionFlag: string;
  SchemeID: number;
  CropID: number;
  AutoNumber: number;
}

export class DrCrDetail {
  BranchCode: string;
  GlSubName: string;
  GlSubCode: string;
  DrAmount: string;
  CrAmount: string;
  LnTransactionDetailID: string;
  LnTransactionID: string;
  VoucherNo: string;
}

export class RecoveryCustomer {
  CustomerID: string;
  LoanAppID: number;
  CustomerName: string;
  Cnic: string;
  FatherName: string;
}

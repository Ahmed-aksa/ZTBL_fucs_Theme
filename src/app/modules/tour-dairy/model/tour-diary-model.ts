export class TourDiaryMCO {
    DiaryId: string;
    TourPlanId: string;
    BranchId: string;
    ZoneId: string;
    CircleId: string;
    Ppno: string;
    TourDate: string;
    DepartureFromPlace: string;
    DepartureFromTime: string;
    ArrivalAtPlace: string;
    ArrivalAtTime: string;
    DisbNoOfCasesReceived: string;
    DisbNoOfCasesAppraised: string;
    DisbNoOfRecordVerified: string;
    DisbNoOfSanctionedAuthorized: string;
    DisbSanctionLetterDelivered: string;
    DisbSupplyOrderDelivered: string;
    NoOfSanctnMutationVerified: string;
    NoOfUtilizationChecked: string;
    RecNoOfNoticeDelivered: string;
    RecNoOfLegalNoticeDelivered: string;
    RecNoOfDefaulterContacted: string;
    TOTFarmersContacted: string;
    TOTNoOfFarmersVisisted: string;
    AnyOtherWorkDone: string;
    Remarks: string;
    NoOfMutationPendingASOPM: string;
    MutationVerifiedDuringMnth: string;
    UtilizationPendingLastDate: string;
    UtilizationVerifiedDuringMnth: string;
    Status: string;
    CreatedBy: string;
}

export class TourDiaryRC {

    DiaryId: string;
    TourPlanId: string;
    BranchId: string;
    ZoneId: string;
    CircleId: string;
    Ppno: string;
    TourDate: string;
    DepartureFromPlace: string;
    DepartureFromTime: string;
    ArrivalAtPlace: string;
    ArrivalAtTime: string;
    Remarks: string;
    Status: string;
    CreatedBy: string;
    NoOfDefaulterContacted: string;
    ResultContactMade: string;
    MeasureBoostUpRecord: string;

}

export class TourDiaryRO {

    DiaryId: string;
    TourPlanId: string;
    BranchId: string;
    ZoneId: string;
    CircleId: string;
    Ppno: string;
    TourDate: string;
    DepartureFromPlace: string;
    DepartureFromTime: string;
    ArrivalAtPlace: string;
    ArrivalAtTime: string;
    Remarks: string;
    Status: string;
    CreatedBy: string;
    NoOfDefaulterContacted: string;
    ResultContactMade: string;
    MeasureBoostUpRecord: string;

}

export class TourDiaryZM {

    DiaryId: string;
    TourPlanId: string;
    BranchId: string;
    ZoneId: string;
    CircleId: string;
    Ppno: string;
    TourDate: string;
    DepartureFromPlace: string;
    DepartureFromTime: string;
    ArrivalAtPlace: string;
    ArrivalAtTime: string;
    LCNotIssuedToBorrowers: string;
    McoNBmTourDiaryAPPlan: string;
    AnyShortComingInDiaries: string;
    NoOfDefaultersContactedByZM: string;
    Remarks: string;
    Status: string;
    CreatedBy: string;
}

export class TourDiaryZC {
    Name: string;
    Ppno: string;
    Month: string;
    Date: string;
    DiaryId: string;
    TourPlanId: string;
    BranchId: string;
    ZoneId: string;
    CircleId: string;
    TourDate: string;
    DepartureFromPlace: string;
    DepartureFromTime: string;
    ArrivalAtPlace: string;
    ArrivalAtTime: string;
    Remarks: string;
    LoanCasesInRecoverySchedule: string;
    GeneralAdmissionComplaints: string;
    CashManagementCompliance: string;
    AuditReports: string;
    OutstandingParas: string;
    Settlements: string;
    Status: string;
    CreatedBy: string;
}

export class TourDiaryPC {

    DiaryId: string;
    TourPlanId: string;
    BranchId: string;
    ZoneId: string;
    CircleId: string;
    Ppno: string;
    TourDate: string;
    DepartureFromPlace: string;
    DepartureFromTime: string;
    ArrivalAtPlace: string;
    ArrivalAtTime: string;
    Remarks: string;
    Status: string;
    CreatedBy: string;
}

export class TourDiary {
    TourPlanId: string[];
    CircleId: string;
    VisitedDate: string;
    Purpose: string;
    Remarks: string;
    Status: string;


}

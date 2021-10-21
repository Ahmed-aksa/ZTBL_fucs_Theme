import {CustomerLandRelation} from "./customer_land_relation.model";


export class LandInfo {
    Zone: string;
    Branch: string;
    Remarks: string;
    LandAutoCode: string;
    DateIssue: string;
    PlaceofIssuePB: string;
    LandingProcedure: string;
    FundBased: string;
    BranchId: number;
    PassbookNO: string;
    UserId: string;
    TotalArea: string;
    TotalOwnedAreaForChargeCreation: string;
    PostCode: number;
    EnteredBy: string;
    Id: number;
    Status: string;
    NumberOfCustomer: number;
    CompleteAddress: number;
    ZoneID: string;
    ZoneName: string;
    customerLandRelation: CustomerLandRelation[];
}

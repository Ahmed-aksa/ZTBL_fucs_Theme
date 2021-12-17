import {Loan} from './Loan.model';
import {DeceasedCustomer, MarkDeceasedCustomer} from "./deceased_customer.model";

export class BaseRequestModel {
    public CustomerDocument: object;
    public Activities: object;
    public Activity: object;
    public Profile: object;
    public User: object;
    public Zone: object;
    public UserInfo: object;
    public Customer: object;
    public Branch: object;
    public UserPasswordDetails: object;
    public Notification: object;
    public ReportFilters: object;
    public Circle: object;
    public Configuration: object;
    public UserHistory: object;
    public DocumentType: object;
    public LandInfo: object;
    public LandInfoDetail: object;
    public LandInfoData: object;
    public ViewDocumnets: object;
    public Rescheduling: object;
    public ChargeCreation: object;
    public ChargeCreationDetail: any;
    public CustomerLandRelation: object;
    public LandInfoDetailsList: any;
    public TranId: number;
    public Loan: Loan;
    public Deceased: DeceasedCustomer;
    public SearchData: object;
    public MarkDeceasedCustomer: MarkDeceasedCustomer;
    public DEVICELOCATION: any;
    public doPerformOTP: any;
    public Target: any;
    public Heading: any;
    public LoanUtilization: any;
    public ChangesTourPlanStatusDto: any;
    public TourPlan: any;
    public OTP: OTP;
    Token: any
    RefreshToken: any
    EligibilityRequest: any;
    DocumentDetail: any;

}

export class OTP {
    Id: any
    Text: any
    Hash: any
    ResendTime: any

}



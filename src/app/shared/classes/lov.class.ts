export class Lov {


    //public PageBit: number;
    //public StartIndex: number;

    //public EndIndex: number;

    public TagName: string;
    //public ParentId: number;
}


export class ChildLov {
    public TagName: string;
    public ParentId: number;
}


export class LovData {

    Success: boolean;
    LOVs: object;
    TranId: string;

}


export class LovConfigurationKey {


    public static readonly Education: string = 'Education';
    public static readonly Cast: string = 'Cast';
    public static readonly MaritalStatus: string = 'MaritalStatus';
    public static readonly Gender: string = 'Gender';
    public static readonly MobileCodes: string = 'MobileCodes';
    public static readonly Occupation: string = 'Occupation';
    public static readonly Religions: string = 'Religions';
    public static readonly Zone: string = 'Zone';
    public static readonly Branch: string = 'Branch';
    public static readonly District: string = 'District';
    public static readonly DistrictProvince: string = 'DistrictProvince';
    public static readonly Province: string = 'Province';
    public static readonly Tehsil: string = 'Tehsil';
    public static readonly Nationality: string = 'Nationality';
    public static readonly BorrowerStatus: string = 'BorrowerStatus';
    public static readonly RiskCategory: string = 'RiskCategory';
    public static readonly PremisesFlag: string = 'PremisesFlag';
    public static readonly Employee: string = 'Employee';
    public static readonly DocumentType: string = 'DocumentNo';
    public static readonly SubmitDocumentType: string = 'DocumentType';


    public static readonly ActiveLoanType: string = 'ActiveLoanType';

    public static readonly CustomerStatus: string = 'CustomerStatus';
    public static readonly EligibilityStatus: string = 'EligibilityStatusLov';
    public static readonly LandStatus: string = 'LandStatus';
    public static readonly PostalCode: string = 'PostalCode';
    public static readonly LandingProcedure: string = 'LendingProcedure';
    public static readonly TransactionType: string = 'TransactionType';
    public static readonly TrCodeDisbursement: string = 'TrCodeDisbursement';
    public static readonly TrCodeRecovery: string = 'TrCodeRecovery';
    public static readonly InstrumentType: string = 'InstrumentType';
    public static readonly JvInstrument: string = 'JvInstrument';

    public static readonly RecoveryThrouth: string = 'RecoveryThrouth';
    public static readonly RecoveryStatus: string = 'RecoveryStatus';
    public static readonly Coordinators: string = 'Coordinators';
    public static readonly SamRecoveryType: string = 'SamRecoveryType';
    public static readonly MakeCapacity: string = 'MakeCapacity';
    public static readonly Units: string = 'Units';
    public static readonly Facility: string = 'Facility';
    public static readonly LoanTypes: string = 'LoanTypes';
    public static readonly LoanCategories: string = 'LoanCategories';
    public static readonly SecurityType: string = 'SecurityType';
    public static readonly Quantity: string = 'Quantity';


    public static readonly RequestCategory: string = 'RequestCategory';


    public static readonly AGPS: string = 'Agps';
    public static readonly Relationship: string = 'Relation';
    public static readonly LegalHeirRelation: string = 'LegalHeirRelation';
    public static readonly ReschedulingTypes: string = 'ReschedulingTypes';
    public static readonly RescheduleStatus: string = 'RescheduleStatus';
    public static readonly MarkupCalcMode: string = 'MarkupCalcMode';
    public static readonly ProposedCropType: string = 'ProposedCropType';
    public static readonly Crops: string = 'Crops';
    public static readonly LoanStatus: string = 'LoanStatus';
    public static readonly SearchChargeCreationType: string = 'SearchChargeCreationType';
    public static readonly JVCategory: string = 'JVCategory';
    public static readonly Glhead: string = 'Glhead';
    public static readonly JvRo: string = 'JvRo';
    public static readonly JvStatus: string = 'JvStatus';
    public static readonly Nature: string = 'Nature';

    public static readonly NadraAccountTypes: string = 'NadraAccountTypes';

    //Deceased
    public static readonly DeceasedCustomerStatus: string = 'DeceasedCustomerStatus';

    //Khaad and Seed Vendor
    public static readonly VendorTypes: string = 'VendorTypes';
    public static readonly FindVendorRadius: string = 'FindVendorRadius';

    //loan utilization

    public static readonly UtilizationTypes: string = 'UtilizationTypes';

    //village wise benchmarking
    public static readonly FarmSizeForVillageWise: string = 'FarmSizeForVillageWise';

    //Reports
    public static readonly BifurcationLCStatus: string = 'BifurcationLCStatus';
    public static readonly DailyVoucherStatus: string = 'DailyVoucherStatus';
    public static readonly InsReportCategory: string = 'InsReportCategory';
    public static readonly InsReportType: string = 'InsReportType';
    public static readonly InsReportCriteria: string = 'InsReportCriteria';
    public static readonly ExpenseDropDown: string = 'ExpenseDropDown';
    public static readonly StatementOfAffairRpt: string = 'StatementOfAffairRpt';
    public static readonly EarlyWarningDays: string = 'EarlyWarningDays';
    public static readonly TourPlanPurpose: string = 'TourPlanPurpose';


}


export const errorMessages: { [key: string]: string } = {
    msisdn: 'MSISDN must be starts with 03 and total of 11 digits',
    cnic: 'CNIC must be 13 digits and not in a sequence i.e. 1111111111111',
    amount: 'Please enter valid amount.',
    fullName: 'Full name must be between 1 and 128 characters',
    email: 'Email must be a valid email address (username@domain)',
    confirmEmail: 'Email addresses must match',
    password: 'Password must be between 7 and 15 characters, and contain at least one number and special character',
    confirmPassword: 'Passwords must match',

    agentUserID: 'Agent User ID must be 4 digits.',
    franchiseID: 'Franchise ID must be 4 digits.',
    agentPin: 'Agent Pin must be 4 digits.',
    agentPinConfirm: 'Agent Pin must match.',
    refrenceNo: 'Reference number must be entered.',


    termsCondition: "You Must agree with terms and conditions",
    subAgencyAgreement: "You Must agree with subagency agreement",
    ibanno: " Please enter IBAN/Number correctly",
    otp: "OTP must be entered and 5 in length",
    ntn: "NTN number must be 7 or 13 in length and not in a sequence i.e. 1111111111111",

    seventothirteen: "must betwen 7 to 13 in lenght",

    familyNumber: "Family number be 6 to 8 charcters in length",
    sequential: "Sequencial input i.e. 1111111111111 is not allowed",

    mobile: "Mobile number must be valid"

};


export class MaskEnum {

    //static cnic = "00000-0000000-0";
    static cnic = "0000000000000";
    static DateFormat = 'ddMMyyyy';//'dd/MM/yyyy';
    static LatLong = '00.000000';
    static MaskPhone = '000000000';

}


export const regExps: { [key: string]: RegExp } = {
    password: /^(?=.*[0-9])(?=.*[!@#$%^&*])[a-zA-Z0-9!@#$%^&*]{7,15}$/,
    msisdn: /^(03)([0-9]{9})$/,
    amount: /^([1-9][0-9]*)$/,
    // cnic: /[0-9]{13}$/,


    //not in sequence cnic
    cnic: /^(?!(\d)\1{12})(?!0123456789|1234567890|0987654321|9876543210)\d{13}$/,


    alphabets: /^[a-zA-Z \-\']+/,

    //////OS Change Set
    agentUserID: /[0-9]{4}$/,
    agentPin: /[0-9]{4}$/,
    otp: /[0-9]{4}$/,
    franchiseID: /[0-9]{4}$/,

    email: /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/,
    refrenceNo: /[a-zA-Z0-9]{14,24}$/,
    ibanno: /[a-zA-Z0-9]{11,24}$/,

    ntn: /^(?:[0-9]{7}|[0-9]{13})$/,

    seventothirteen: /[0-9]{7,13}$/,
    //ibanno: /^(?:[A-Za-z0-9]{5}|[A-Za-z0-9]{9})$/,

    familyNumber: /[a-zA-Z0-9]{6,8}$/,


    sequential: /^(?:0(?=1|$))?(?:1(?=2|$))?(?:2(?=3|$))?(?:3(?=4|$))?(?:4(?=5|$))?(?:5(?=6|$))?(?:6(?=7|$))?(?:7(?=8|$))?(?:8(?=9|$))?(?:9$)?$|^([0-9])\\1{4,}$|^(?:9(?=9|$))?(?:9(?=8|$))?(?:8(?=7|$))?(?:7(?=6|$))?(?:6(?=5|$))?(?:5(?=4|$))?(?:4(?=3|$))?(?:3(?=2|$))?(?:2(?=1|$))?(?:1$)?$/,


    sequentialsecond: /^([0-9])\1*$/,

    mobile: /[0-9]{8}$/,
    landMarla: /^[0-9]+[-]+[0-9]+[-]+[0-9]+$/
};


export const DateFormats = {
    parse: {
        dateInput: ['YYYY-MM-DD']
    },
    display: {
        dateInput: 'DDMMyyyy',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'LL',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};

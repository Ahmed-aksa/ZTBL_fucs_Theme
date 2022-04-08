import {ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {CreateCustomer} from 'app/shared/models/customer.model';
import {LoanCustomer} from 'app/shared/models/loan-customer';
import {CustomersLoanApp, Loan} from 'app/shared/models/Loan.model';
import {CustomerService} from 'app/shared/services/customer.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LoanService} from 'app/shared/services/loan.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {MatDialog} from "@angular/material/dialog";
import {CustLoanlistComponent} from "../customer-list/cust-list.component";
import {Activity} from "../../../shared/models/activity.model";
import {EncryptDecryptService} from "../../../shared/services/encrypt_decrypt.service";

@Component({
    selector: 'kt-cl-customers',
    templateUrl: './cl-customers.component.html',
    styleUrls: ['./cl-customers.component.scss']
})
export class ClCustomersComponent implements OnInit {
    hasFormErrors = false;
    loanCustomerForm: FormGroup;
    LoggedInUserInfo: BaseResponseModel;
    public LovCall = new Lov();
    public AGPSLov: any;
    public RelationshipLov: any;
    agpsModel: any;
    relationshipModel: any;
    //Global Variables
    public loanCustomer = new LoanCustomer();
    public customerArray: CustomerGrid[] = [];
    public createCustomer = new CreateCustomer();
    public customerLoanApp = new CustomersLoanApp();


    loan_data = [];


    @Input() loanDetail: Loan;
    @Input('customersList') customer_list;
    @Output() loanCustomerCall: EventEmitter<any> = new EventEmitter();
    currentActivity: Activity;

    constructor(private formBuilder: FormBuilder,
                private userUtilsService: UserUtilsService,
                private _lovService: LovService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private cdRef: ChangeDetectorRef,
                private layoutUtilsService: LayoutUtilsService,
                private _loanService: LoanService,
                private spinner: NgxSpinnerService,
                private _customerService: CustomerService,
                public dialog: MatDialog,
                private enc: EncryptDecryptService ) {
    }

    ngOnInit() {
        this.currentActivity = this.userUtilsService.getActivity('Create Loan')
        this.LoadLovs();
        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
        this.createForm();

    }

    callfromPartnet() {
        this.loan_data = JSON.parse(this.enc.decryptStorageData(localStorage.getItem('customer_loan_list')));
    }

    createForm() {
        this.loanCustomerForm = this.formBuilder.group({
            CNIC: [this.loanCustomer.CNIC, [Validators.required]],
            AGPS: [this.loanCustomer.AGPS, [Validators.required]],
            Relationship: [this.loanCustomer.RelationShip, [Validators.required]]
        });

    }

    hasError(controlName: string, errorName: string): boolean {
        return this.loanCustomerForm.controls[controlName].hasError(errorName);
    }

    async LoadLovs() {


        var tempArray = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.AGPS});
        this.AGPSLov = tempArray.LOVs;

        tempArray = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Relationship})
        this.RelationshipLov = tempArray.LOVs;

    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    attachCustomer() {

        this.hasFormErrors = false;
        if (this.loanCustomerForm.invalid) {
            const controls = this.loanCustomerForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }

        if (this.loan_data?.length == 0 || this.loan_data == undefined) {
            if (this.loanCustomerForm.controls.AGPS.value != "A") {
                this.layoutUtilsService.alertElement("", "First time AGPS must be Applicant");
                return
            }

            if (this.loanCustomerForm.controls.Relationship.value != "8") {
                this.layoutUtilsService.alertElement("", "First time Relationship must be selected self");
                return
            }
        }

        var duplicateCustomer = this.loan_data?.filter(x => x.Cnic == this.loanCustomerForm.controls['CNIC'].value)[0];
        if (duplicateCustomer != undefined && duplicateCustomer != null) {
            this.layoutUtilsService.alertElement("", "Customer CNIC Already Added", "Duplicate Cutomer");
            return;
        }
        this.customerLoanApp.LoanAppID = this.loanDetail?.ApplicationHeader?.LoanAppID;
        if (!this.customerLoanApp.LoanAppID) {
            this.layoutUtilsService.alertMessage("", "Add Application Header First");
            return;
        }

        this.createCustomer.CustomerStatus = 'A';

        this.customerLoanApp.Cnic = this.loanCustomerForm.controls['CNIC'].value;
        this.customerLoanApp.RelationID = parseInt(this.loanCustomerForm.controls['Relationship'].value);

        // this.customerLoanApp.LoanCaseNumber = this.loanDetail.ApplicationHeader.LoanCaseNo;
        this.customerLoanApp.Agps = this.loanCustomerForm.controls['AGPS'].value;

        this.spinner.show();
        this._loanService
            .saveCustomerWithLoanApp(this.customerLoanApp, this.loanDetail.TranId)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    let loan_case_number = this.loanDetail.ApplicationHeader.LoanCaseNo;
                    let loan_case_id = this.loanDetail.ApplicationHeader.LoanAppID;

                    this._loanService.getLoanDetails(loan_case_number, loan_case_id).subscribe((data: any) => {
                        this.loan_data = data.Loan.CustomersLoanAppList
                        localStorage.setItem('customer_loan_list', this.enc.encryptStorageData( JSON.stringify(this.loan_data)));
                    })
                    this.loanCustomerForm.controls['CNIC'].setValue("");
                    this.loanCustomerForm.controls['AGPS'].setValue("");
                    this.loanCustomerForm.controls['Relationship'].setValue("");
                    Object.keys(this.loanCustomerForm.controls).forEach(key => {
                        this.loanCustomerForm.get(key).markAsUntouched();
                    });
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

            });

    }


    loadAppCustomerDataOnUpdate(appCustomerData) {
        var tempAgpsLovs = this.AGPSLov;
        var tempRelationshipLovs = this.RelationshipLov;

        var tempCustomerArray: CustomerGrid[] = [];

        appCustomerData.forEach(function (item, key) {

            var grid = new CustomerGrid();
            grid.CustLoanAppID = item.CustLoanAppID;
            grid.cnic = item.Cnic;
            grid.name = item.CustomerName;
            grid.fatherName = item.FatherName;
            grid.dob = item.DOB;
            //grid.agps = this.agpsModel

            var tempAgpsLov = tempAgpsLovs?.filter(v => v.Id == item.Agps)
            if (tempAgpsLov?.length > 0)
                grid.agpsName = tempAgpsLov[0].Name;
            else
                grid.agpsName = item.Agps;
            //grid.Relationship = this.relationshipModel;

            var tempRealtionshipLov = tempRelationshipLovs?.filter(v => v.Id == item.RelationID);
            if (tempRealtionshipLov?.length > 0)
                grid.RelationshipName = tempRealtionshipLov[0].Name;
            else
                grid.RelationshipName = "";
            tempCustomerArray.push(grid);


        });

        this.customerArray = tempCustomerArray;

    }

    viewCustomer() {

        const dialogRef = this.dialog.open(CustLoanlistComponent, {
            data: {flag: 1},
            disableClose: true,
            panelClass: ['w-full', 'h-screen', 'max-w-full', 'max-h-full']
        });
        dialogRef.afterClosed().subscribe(res => {

            if (!res) {
                return;
            }
        });


    }

    deleteRow(customerObj, index) {

        const _title = 'Confirmation';
        const _description = 'Do you really want to continue?';
        const _waitDesciption = '';
        const _deleteMessage = ``;

        const dialogRef = this.layoutUtilsService.AlertElementConfirmation(_title, _description, _waitDesciption);


        dialogRef.afterClosed().subscribe(res => {

            if (!res) {
                return;
            }

            if (this.loan_data?.length == 0) {
                return false;
            } else {
                if (customerObj.CustLoanAppID == null || customerObj.CustLoanAppID == undefined || customerObj.CustLoanAppID == "") {
                    this.loan_data.splice(index, 1);
                    localStorage.setItem('customer_loan_list',this.enc.encryptStorageData(  JSON.stringify(this.loan_data)));
                    this.cdRef.detectChanges();
                    return true;
                } else {
                    this.spinner.show();
                    this._loanService.deleteCustomerLoanApplication(customerObj.CustLoanAppID)
                        .pipe(
                            finalize(() => {
                                this.spinner.hide();

                            })
                        )
                        .subscribe(baseResponse => {
                            if (baseResponse.Success === true) {
                                const dialogRef = this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                                this.loan_data.splice(index, 1);
                                localStorage.setItem('customer_loan_list',this.enc.encryptStorageData(  JSON.stringify(this.loan_data)));
                                localStorage.setItem('delete_security',this.enc.encryptStorageData(  'true'));
                            } else {
                                this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                            }

                        })
                }


            }


        })


    }

    onSaveCustomer() {

        if (this.loanDetail == null || this.loanDetail == undefined) {
            this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
            return;
        }
        //
        // if (this.loan_data[this.loan_data.length - 1]?.CustLoanAppID) {
        //     this.layoutUtilsService.alertMessage("", "Records already saved");
        //     return;
        // }

        if (this.loan_data?.length > 0) {
            this.spinner.show();
            var isCustomerAdded = false;
            var resMessage = "";
            var resCode = "";
            var customerAdded = 0;

            this.loan_data.forEach(cus => {
                this.customerLoanApp.Cnic = cus.Cnic;
                this.customerLoanApp.RelationID = parseInt(cus.RelationID);
                this.customerLoanApp.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
                //this.customerLoanApp.LoanAppID = 0;
                this.customerLoanApp.Agps = cus.Agps;
                this._loanService.saveCustomerWithLoanApp(this.customerLoanApp, this.loanDetail.TranId)
                    .pipe(
                        finalize(() => {
                            this.spinner.hide();

                            if (this.loan_data.length == customerAdded) {
                                const dialogRef = this.layoutUtilsService.alertElementSuccess("", resMessage, resCode);
                            }
                        })
                    )
                    .subscribe(baseResponse => {

                        customerAdded++;
                        if (baseResponse.Success) {

                            isCustomerAdded = true;
                            resMessage = baseResponse.Message;
                            resCode = baseResponse.Code;
                            //this.customerLoanApp.CustLoanAppID = baseResponse.Loan.CustomersLoanApp.CustLoanAppID;
                            cus.CustLoanAppID = baseResponse.Loan.CustomersLoanApp.CustLoanAppID;
                            var addedCustomer = new CustomersLoanApp();
                            addedCustomer.CustLoanAppID = baseResponse.Loan.CustomersLoanApp.CustLoanAppID;
                            addedCustomer.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
                            addedCustomer.RelationID = cus.RelationID;
                            addedCustomer.Cnic = cus.cnic;
                            addedCustomer.Agps = cus.agps;
                            addedCustomer.CustomerName = cus.name;
                            this.loanDetail.CustomersLoanList.push(addedCustomer);
                            this.loanDetail.CustomersLoanApp = this.customerLoanApp;


                            this.loanCustomerCall.emit(this.loanDetail);

                            // this.customerArray=[];
                            //   this.searchCustomer()
                            //const dialogRef = this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                        } else {
                            //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                        }
                    });
            })


        } else {
            this.layoutUtilsService.alertElement("No Record to save", "No Record to Save");
        }
    }

    returnKeyValuePair(value: any, type: string) {
        let key = '';
        if (type == 'agps') {
            if (this.AGPSLov) {
                this.AGPSLov?.filter((single_agps) => {
                    if (single_agps.Value == value) {
                        key = single_agps.Name
                    }
                })
            }
        } else if (type = 'relation') {
            if (this.RelationshipLov) {
                this.RelationshipLov?.filter((single_relation_ship) => {
                    if (single_relation_ship.Value == value) {
                        key = single_relation_ship.Name
                    }
                })
            }
        }
        return key;
    }
}

export class CustomerGrid {
    CustLoanAppID: number;
    cnic: string;
    name: string;
    fatherName: string;
    dob: string;
    agps: string;
    agpsName: string;
    Relationship: string;
    RelationshipName: string;
}

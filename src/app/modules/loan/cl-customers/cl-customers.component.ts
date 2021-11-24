import {Component, OnInit, ChangeDetectorRef, Input, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
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
    @Input() loanDetail: Loan;
    @Output() loanCustomerCall: EventEmitter<any> = new EventEmitter();
    @Output() disable_tab: EventEmitter<any> = new EventEmitter();

    constructor(private formBuilder: FormBuilder,
                private userUtilsService: UserUtilsService,
                private _lovService: LovService,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private cdRef: ChangeDetectorRef,
                private layoutUtilsService: LayoutUtilsService,
                private _loanService: LoanService,
                private spinner: NgxSpinnerService,
                private _customerService: CustomerService) {
    }

    ngOnInit() {

        this.LoadLovs();
        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
        this.createForm();

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

        //this.ngxService.start();
        var tempArray = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.AGPS});
        this.AGPSLov = tempArray.LOVs;

        tempArray = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Relationship})
        this.RelationshipLov = tempArray.LOVs;

    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    searchCustomer() {

        if (this.customerArray.length == 0) {
            if (this.loanCustomerForm.controls.AGPS.value != "1") {
                this.layoutUtilsService.alertElement("", "First time AGPS must be Applicant");
                return
            }

            if (this.loanCustomerForm.controls.Relationship.value != "8") {
                this.layoutUtilsService.alertElement("", "First time Relationship must be selected self");
                return
            }
        }


        this.hasFormErrors = false;
        if (this.loanCustomerForm.invalid) {
            const controls = this.loanCustomerForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }


        var duplicateCustomer = this.customerArray.filter(x => x.cnic == this.loanCustomerForm.controls['CNIC'].value)[0];
        if (duplicateCustomer != undefined && duplicateCustomer != null) {
            this.layoutUtilsService.alertElement("", "Customer CNIC Already Added", "Duplicate Cutomer");
            return;
        }
        this.createCustomer.CustomerStatus = 'A';

        this.createCustomer.Cnic = this.loanCustomerForm.controls['CNIC'].value;


        this.spinner.show();
        this._customerService
            .searchCustomer(this.createCustomer)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {

                    var customer = baseResponse.Customers[0];
                    var grid = new CustomerGrid();
                    grid.cnic = this.loanCustomerForm.controls['CNIC'].value
                    grid.name = customer.CustomerName
                    grid.fatherName = customer.FatherName
                    grid.dob = customer.Dob
                    grid.agps = this.agpsModel
                    grid.agpsName = this.AGPSLov.filter(v => v.Id == this.agpsModel)[0].Name;
                    grid.Relationship = this.relationshipModel;
                    grid.RelationshipName = this.RelationshipLov.filter(v => v.Id == this.relationshipModel)[0].Name;
                    this.customerArray.push(grid);

                    //this.dynamicArray[index].area = this.createCustomer


                    this.cdRef.detectChanges();

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
            if (tempAgpsLov.length > 0)
                grid.agpsName = tempAgpsLov[0].Name;
            else
                grid.agpsName = item.Agps;
            //grid.Relationship = this.relationshipModel;

            var tempRealtionshipLov = tempRelationshipLovs.filter(v => v.Id == item.RelationID);
            if (tempRealtionshipLov.length > 0)
                grid.RelationshipName = tempRealtionshipLov[0].Name;
            else
                grid.RelationshipName = "";
            tempCustomerArray.push(grid);


        });

        this.customerArray = tempCustomerArray;

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

            if (this.customerArray.length == 0) {
                return false;
            } else {
                if (customerObj.CustLoanAppID == null || customerObj.CustLoanAppID == undefined || customerObj.CustLoanAppID == "") {
                    this.customerArray.splice(index, 1);
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
                                if (this.customerArray[0] && (this.customerArray[0]?.agps == 'A' || this.customerArray[0]?.Relationship == '8')) {
                                    this.disable_tab.emit(false);
                                } else {
                                    this.disable_tab.emit(true);
                                }
                                const dialogRef = this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                                this.customerArray.splice(index, 1);
                            }

                        })
                }


            }


        })


    }

    onSaveCustomer() {
        if (this.customerArray[0] && (this.customerArray[0]?.agps == 'A' || this.customerArray[0]?.Relationship == '8')) {
            this.disable_tab.emit(false);
        } else {
            this.disable_tab.emit(true);
        }
        if (this.loanDetail == null || this.loanDetail == undefined) {
            this.layoutUtilsService.alertMessage("", "Application Header Info Not Found");
            return;
        }
        if (this.customerArray.length > 0) {
            this.spinner.show();
            var isCustomerAdded = false;
            var resMessage = "";
            var resCode = "";
            var customerAdded = 0;

            this.customerArray.forEach(cus => {
                this.customerLoanApp.Cnic = cus.cnic;
                this.customerLoanApp.RelationID = parseInt(cus.Relationship);
                this.customerLoanApp.LoanAppID = this.loanDetail.ApplicationHeader.LoanAppID;
                //this.customerLoanApp.LoanAppID = 0;
                this.customerLoanApp.Agps = cus.agps;
                this._loanService.saveCustomerWithLoanApp(this.customerLoanApp, this.loanDetail.TranId)
                    .pipe(
                        finalize(() => {
                            this.spinner.hide();

                            if (this.customerArray.length == customerAdded) {
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
                            addedCustomer.RelationID = parseInt(cus.Relationship);
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

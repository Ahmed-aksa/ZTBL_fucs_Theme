import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from "ngx-spinner";
import {finalize} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LayoutUtilsService} from '../../shared/services/layout-utils.service';
import {MatTableDataSource} from '@angular/material/table';
import {BorrowerInformationService} from "./service/borrower-information.service";
import {CircleService} from "../../shared/services/circle.service";
import {BaseResponseModel} from "../../shared/models/base_response.model";
import {Branch} from "../../shared/models/branch.model";
import {Zone} from "../../shared/models/zone.model";
import {UserUtilsService} from "../../shared/services/users_utils.service";

@Component({
    selector: 'kt-borrower-information',
    templateUrl: './borrower-information.component.html',
    styleUrls: ['./borrower-information.component.scss']
})
export class BorrowerInformationComponent implements OnInit {
    displayedColumns = ['CustomerName', 'FatherName', 'Cnic', 'PhoneNumber', 'InterestRate', 'PermanentAddress'];
    matTableLenght: boolean = false;
    PPNOVisible:boolean=true;
    borrowerForm: FormGroup;

    dv;
    itemsPerPage = 10;
    totalItems;
    pageIndex = 1;
    OffSet = 0;
    loaded = false;
    user: any = {};

    hasBranch: boolean = false;
    hasCircle: boolean = false;

    LoggedInUserInfo: BaseResponseModel;

    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    public Zone = new Zone();

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();
    disable_circle = true;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    single_zone = true;
    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];
    public Circle = new Branch();
    dataSource: MatTableDataSource<Borrowers>

    selected_b;
    selected_z;
    selected_c;

    constructor(
        private _borrowerInfo: BorrowerInformationService,
        private layoutUtilsService: LayoutUtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
        private userUtilsService: UserUtilsService,
        private _circleService: CircleService,
    ) {
    }


    ngOnInit() {
        this.createForm();
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();

        if (this.LoggedInUserInfo.Branch && this.LoggedInUserInfo.Branch.BranchCode != "All") {
            this.SelectedCircles = this.LoggedInUserInfo.UserCircleMappings;

            this.SelectedBranches = this.LoggedInUserInfo.Branch;
            this.SelectedZones = this.LoggedInUserInfo.Zone;

            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.selected_c = this.SelectedCircles?.Id
            this.borrowerForm.controls["Zone"].setValue(this.SelectedZones?.Id);
            this.borrowerForm.controls["Branch"].setValue(this.SelectedBranches?.BranchCode);
            var fi: any = []
            fi.Id = "null";
            fi.CircleCode = "All";
            fi.LovId = "0";
            fi.TagName = "0";
            this.SelectedCircles.splice(0, 0, fi)
            this.borrowerForm.controls["Circle"].setValue(this.SelectedCircles ? this.SelectedCircles[0].Id : "")
            if (this.borrowerForm.value.Branch) {
                this.changeBranch(this.borrowerForm.value.Branch);
            }
        } else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
            this.spinner.show();
            this.userUtilsService.getZone().subscribe((data: any) => {
                this.Zone = data?.Zones;
                this.SelectedZones = this?.Zone;
                this.single_zone = false;
                this.disable_zone = false;
                this.spinner.hide();
            });
            this.getBorrower();

        }
        this.settingPPNoFeild()
    }

settingPPNoFeild(){
    var userInfo = this.userUtilsService.getUserDetails();

    // console.log(userInfo);
    //MCO User
    if (userInfo.User.userGroup[0].ProfileID == "56") {
    this.PPNOVisible = false;
}
}

    createForm() {
        this.borrowerForm = this.fb.group({
            Zone: [null],
            Branch: [null],
            Circle: [null],
            Cnic: [null],
            PPNo:[null],
        })
    }

    getBorrower() {
        var cnic = this.borrowerForm.controls.Cnic.value;
        this.user.ZoneId = this.borrowerForm.controls.Zone.value;
        if (this.SelectedBranches.length != undefined) {
            this.user.Branch = this.SelectedBranches.filter((branch) => branch.BranchCode == this.borrowerForm.controls.Branch.value);
        } else {
            this.user.Branch = this.SelectedBranches;
        }
        if (cnic != null) {
            this.OffSet = 0;
        }
        this.user.CircleId = this.borrowerForm.controls.Circle.value;
        this.spinner.show();
        this._borrowerInfo.getBorrowerInformation(this.itemsPerPage, this.OffSet, cnic, this.user)
            .pipe(
                finalize(() => {
                    this.loaded = true;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.dataSource = baseResponse.BorrowerInfo.Borrowers;
                    this.dv = this.dataSource;
                    this.matTableLenght = true
                    this.totalItems = baseResponse.BorrowerInfo.Borrowers[0].TotalRecords
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {

        this.itemsPerPage = pageSize;
        this.OffSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.getBorrower();
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }

    viewInquiry(borrower) {
        var Lcno = borrower.LoanCaseNo;
        //var LnTransactionID = this.JvForm.controls.LoanDisbID.value;

        const url = this.router.serializeUrl(
            this.router.createUrlTree(['../loan-recovery/loan-inquiry', {
                LnTransactionID: "",
                Lcno: Lcno
            }], {relativeTo: this.activatedRoute})
            //this.router.createUrlTree(['../loan-inquiry', { LnTransactionID: LnTransactionID, Lcno: Lcno }], { relativeTo: this.activatedRoute })
        );
        window.open(url, '_blank');
    }

    changeZone(changedValue) {
        let changedZone = {Zone: {ZoneId: changedValue.value}}
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.Branches = data.Branches;
            this.SelectedBranches = this.Branches;
            this.single_branch = false;
            this.disable_branch = false;
        });
    }


    changeBranch(changedValue) {
        let changedBranch = null;
        if (changedValue.value)
            changedBranch = {Branch: {BranchCode: changedValue.value}}
        else
            changedBranch = {Branch: {BranchCode: changedValue}}

        this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {

            this.Circles = data.Circles;
            this.SelectedCircles = this.Circles;
            this.disable_circle = false;
            var fi: any = []
            fi.Id = "null";
            fi.CircleCode = "All";
            fi.LovId = "0";
            fi.TagName = "0";
            this.SelectedCircles.splice(0, 0, fi)
            this.borrowerForm.controls["Circle"].setValue(this.SelectedCircles ? this.SelectedCircles[0].Id : "")
            if (changedValue.value) {
                this.getBorrower();
            }
        });
    }

    MathCeil(value: any) {
        return Math.ceil(value);
    }
}

interface Borrowers {
    CustomerName: string;
    Name: string;
    PhoneNumber: string;
    Cnic: string;
    FatherName: string;
    PermanentAddress: string;
    InterestRate: string;
    TotalRecords: string
}

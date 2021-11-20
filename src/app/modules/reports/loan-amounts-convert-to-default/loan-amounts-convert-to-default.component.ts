import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialogRef} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {SearchLoanCaseByCnic} from '../class/reports';
import {ReportsService} from '../service/reports.service';
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'loan-amounts-convert-to-default',
    templateUrl: './loan-amounts-convert-to-default.component.html',
    styleUrls: ['./loan-amounts-convert-to-default.component.scss']
})
export class LoanAmountsConvertToDefaultComponent implements OnInit {
    displayedColumns = ['Lcno', 'Cnic', 'Name', 'FatherName', 'Address', 'Bcl', 'Los'];
    searchCnicForm: FormGroup;
    selected_b;
    selected_z;
    selected_c;
    loaded = true;
    disable_circle = true;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    single_zone = true;

    public reports = new SearchLoanCaseByCnic();

    matTableLenght = false;
    loading = false;

    itemsPerPage = 10;
    pageIndex = 1;
    totalItems: number | any;
    dv: number | any; //use later

    dataSource: MatTableDataSource<searchLoanCasesByCnic>;

    LoggedInUserInfo: BaseResponseModel;

    //Zone inventory
    Zones: any = [];
    user: any = {}
    SelectedZones: any = [];

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];

    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];
    private final_branch: any;
    private final_zone: any;

    statusLov: any;
    public LovCall = new Lov();


    constructor(
        private fb: FormBuilder,
        private _reports: ReportsService,
        private userUtilsService: UserUtilsService,
        private spinner: NgxSpinnerService,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit(): void {
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm()
        // this.typeLov();

        if (this.LoggedInUserInfo.Branch != null) {
            this.Circles = this.LoggedInUserInfo.UserCircleMappings;
            this.SelectedCircles = this.Circles;
            this.disable_circle = false;

            this.Branches = this.LoggedInUserInfo.Branch;
            this.SelectedBranches = this.Branches;

            this.Zones = this.LoggedInUserInfo.Zone;
            this.SelectedZones = this.Zones;

            this.selected_z = this.SelectedZones.ZoneId
            this.selected_b = this.SelectedBranches.BranchCode
            this.selected_c = this.SelectedCircles.Id
            this.searchCnicForm.controls["ZoneId"].setValue(this.SelectedZones?.Id);
            this.searchCnicForm.controls["BranchCode"].setValue(this.SelectedBranches?.Name);
            this.changeBranch(this.selected_b)
        } else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
            this.spinner.show();

            this.userUtilsService.getZone().subscribe((data: any) => {
                this.Zones = data.Zones;
                this.SelectedZones = this.Zones;
                this.single_zone = false;
                this.disable_zone = false;
                this.spinner.hide();

            });
        }


    }

    createForm() {
        this.searchCnicForm = this.fb.group({
            ZoneId: [null, Validators.required],
            BranchCode: [null, Validators.required],
            CircleCode: [null, Validators.required],
            // ReportsFormatType: [null, Validators.required],
            // Status: [null, Validators.required],
            PPNO: [null, Validators.required]
        })
    }

    private assignBranchAndZone() {


        //Branch
        if (this.SelectedBranches.length) {
            this.final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0];
            this.LoggedInUserInfo.Branch = this.final_branch;
        } else {
            this.final_branch = this.SelectedBranches;
            this.LoggedInUserInfo.Branch = this.final_branch;
        }
        //Zone
        if (this.SelectedZones.length) {
            this.final_zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
            this.LoggedInUserInfo.Zone = this.final_zone;
        } else {
            this.final_zone = this.SelectedZones;
            this.LoggedInUserInfo.Zone = this.final_zone;
        }

    }

    select: Selection[] = [
        {Value: '2', description: 'Portable Document Format (PDF)'},
        {Value: '1', description: 'MS Excel (Formatted)'},
        {Value: '3', description: 'MS Excel (Data Only Non Formatted)'}
    ];

    find() {
        this.searchCnicForm.controls["PPNO"].setValue(this.LoggedInUserInfo.User.UserName);

        if (this.searchCnicForm.invalid) {
            this.toastr.error("Please enter requried fields");
            return;
        }
        this.assignBranchAndZone();
        this.user.Branch = this.final_branch;
        this.user.Zone = this.final_zone;
        this.user.Circle = this.searchCnicForm.controls.CircleCode.value;

        this.reports = Object.assign(this.reports, this.searchCnicForm.value);
        this.reports.ReportsNo = "19";
        this.spinner.show();
        this._reports.reportDynamic(this.user, this.reports)
            .pipe(
                finalize(() => {
                    this.loaded = true;
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {

                    this.loading = true;
                    this.dataSource = baseResponse.ReportsFilterCustom.SamNplLoans
                    this.dv = this.dataSource;
                    this.matTableLenght = true

                    this.totalItems = baseResponse.ReportsFilterCustom.SamNplLoans[0].TotalRecords
                } else {

                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    this.loading = false;
                    this.matTableLenght = false;
                    this.dataSource = this.dv?.slice(1, 0);
                    //this.offSet = 0;
                    this.pageIndex = 1;

                }
            })
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.pageIndex = pageIndex;
        //this.OffSet = pageIndex;

        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
    }

    // async typeLov() {
    //     this.statusLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.BifurcationLCStatus});
    //     this.statusLov = this.statusLov.LOVs;
    //     this.searchCnicForm.controls["Status"].setValue(this.statusLov ? this.statusLov[0].Value : "")
    // }

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
        if (changedValue.value) {
            changedBranch = {Branch: {BranchCode: changedValue.value}}
        } else {
            changedBranch = {Branch: {BranchCode: changedValue}}

        }
        this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {
            this.Circles = data.Circles;
            this.SelectedCircles = this.Circles;
            var fi: any = []
            fi.Id = "null";
            fi.CircleCode = "----Please Select----";
            fi.LovId = "0";
            fi.TagName = "0";
            this.SelectedCircles.splice(0, 0, fi)
            this.searchCnicForm.controls["CircleCode"].setValue(this.SelectedCircles ? this.SelectedCircles[0].Id : "")
            this.disable_circle = false;
        });
    }
}

export interface Selection {
    Value: string;
    description: string;
}

interface searchLoanCasesByCnic {
    LcNo: string;
}


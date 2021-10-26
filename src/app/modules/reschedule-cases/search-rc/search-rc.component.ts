/* eslint-disable eol-last */
/* eslint-disable arrow-parens */
/* eslint-disable curly */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable prefer-const */
/* eslint-disable guard-for-in */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/member-ordering */
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { LovService } from '../../../shared/services/lov.service';
import {
    DateFormats,
    Lov,
    LovConfigurationKey,
} from '../../../shared/classes/lov.class';
import { BaseResponseModel } from '../../../shared/models/base_response.model';
import { MatTableDataSource } from '@angular/material/table';
import { CircleService } from '../../../shared/services/circle.service';
import { UserUtilsService } from '../../../shared/services/users_utils.service';
import { finalize } from 'rxjs/operators';
import { ReschedulingService } from '../service/rescheduling.service';
import { Loan } from '../../../shared/models/Loan.model';
import { Branch } from 'app/shared/models/branch.model';
import { Zone } from 'app/shared/models/zone.model';
import { LayoutUtilsService } from '../../../shared/services/layout_utils.service';
import { DatePipe } from '@angular/common';
import {
    DateAdapter,
    MAT_DATE_FORMATS,
    MAT_DATE_LOCALE,
} from '@angular/material/core';
import { MomentDateAdapter } from '@angular/material-moment-adapter';

@Component({
    selector: 'app-search-rc',
    templateUrl: './search-rc.component.html',
    styleUrls: ['./search-rc.component.scss'],
    providers: [
        DatePipe,
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        { provide: MAT_DATE_FORMATS, useValue: DateFormats },
    ],
})
export class SearchRcComponent implements OnInit {
    today = new Date();
    loading: boolean;
    rcSearch: FormGroup;
    LoggedInUserInfo: BaseResponseModel;
    isZoneReadOnly: boolean;
    isBranchReadOnly: boolean;

    single_zone: boolean = true;
    disable_zone: boolean = true;

    selected_z: any;
    selected_b: any;

    single_branch: any = true;
    disable_branch: any = true;

    final_branch: any;
    final_zone: any;
    Math: any;

    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;
    dv: number | any; //use later

    OffSet: any;

    matTableLenght: boolean;

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();
    public search = new Loan();
    public LovCall = new Lov();

    //Loan Status inventory
    LoanStatus: any = [];
    loanStatus: any = [];
    SelectedLoanStatus: any = [];

    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];
    public Zone: any;
    displayedColumns = [
        'Branch',
        'TransactionDate',
        'LoanApp',
        'GlDescription',
        'Status',
        'Scheme',
        'OldDate',
        'AcStatus',
    ];
    dataSource: MatTableDataSource<SearchRC>;
    ELEMENT_DATA: SearchRC[] = [];
    Mydata: any;
    //Zone inventory
    Circles: any = [];
    SelectedCircles: any = [];

    constructor(
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private _circleService: CircleService,
        private cdRef: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private _reschedulingService: ReschedulingService,
        private spinner: NgxSpinnerService,
        private _lovService: LovService
    ) {
        this.Math = Math;
    }

    ngOnInit() {
        this.create();
        this.isZoneReadOnly = false;
        this.isBranchReadOnly = false;

        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

        //-------------------------------Loading Zone-------------------------------//

        //-------------------------------Loading Circle-------------------------------//
        if (
            this.LoggedInUserInfo.Branch &&
            this.LoggedInUserInfo.Branch.BranchCode != 'All'
        ) {
            this.SelectedBranches = this.LoggedInUserInfo.Branch;
            this.SelectedZones = this.LoggedInUserInfo.Zone;

            this.selected_z = this.SelectedZones?.ZoneId;
            this.selected_b = this.SelectedBranches?.BranchCode;
            this.rcSearch.controls['Zone'].setValue(this.SelectedZones?.ZoneId);
            this.rcSearch.controls['Branch'].setValue(
                this.SelectedBranches?.BranchCode
            );
        } else if (
            !this.LoggedInUserInfo.Branch &&
            !this.LoggedInUserInfo.Zone &&
            !this.LoggedInUserInfo.Zone
        ) {
            this.spinner.show();
            this.userUtilsService.getZone().subscribe((data: any) => {
                this.Zone = data?.Zones;
                this.SelectedZones = this?.Zone;
                this.single_zone = false;
                this.disable_zone = false;
                this.spinner.hide();
            });
        }
        this.getLoanStatus();
    }

    changeZone(changedValue) {
        let changedZone = { Zone: { ZoneId: changedValue.value } };
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.Branches = data.Branches;
            this.SelectedBranches = this.Branches;
            this.single_branch = false;
            this.disable_branch = false;
        });
    }

    private assignBranchAndZone() {
        if (this.SelectedBranches.length)
            this.final_branch = this.SelectedBranches?.filter(
                (circ) => circ.BranchCode == this.selected_b
            )[0];
        else this.final_branch = this.SelectedBranches;
        let zone = null;
        if (this.SelectedZones.length)
            this.final_zone = this.SelectedZones?.filter(
                (circ) => circ.ZoneId == this.selected_z
            )[0];
        else this.final_zone = this.SelectedZones;
    }

    create() {
        this.rcSearch = this.fb.group({
            Zone: [''],
            Branch: [''],
            TrDate: [''],
            Lcno: [''],
            Status: [''],
        });
    }

    //-------------------------------Loan Status Functions-------------------------------//
    async getLoanStatus() {
        this.LoanStatus = await this._lovService.CallLovAPI(
            (this.LovCall = { TagName: LovConfigurationKey.RescheduleStatus })
        );
        this.SelectedLoanStatus = this.LoanStatus.LOVs.reverse();

        console.log(this.SelectedLoanStatus);
    }

    searchLoanStatus(loanStatusId) {
        loanStatusId = loanStatusId.toLowerCase();
        if (
            loanStatusId != null &&
            loanStatusId != undefined &&
            loanStatusId != ''
        )
            this.SelectedLoanStatus = this.LoanStatus.LOVs.filter(
                (x) => x.Name.toLowerCase().indexOf(loanStatusId) > -1
            );
        else this.SelectedLoanStatus = this.LoanStatus.LOVs;
    }

    validateLoanStatusOnFocusOut() {
        if (this.SelectedLoanStatus.length == 0)
            this.SelectedLoanStatus = this.LoanStatus;
    }

    find() {
        this.assignBranchAndZone();
        this.spinner.show();
        this.search = Object.assign(this.rcSearch.getRawValue());
        console.log(this.search);

        this._reschedulingService
            .RescheduleSearch(this.search, this.final_branch, this.final_zone)
            .pipe(
                finalize(() => {
                    this.spinner.hide();

                    this.cdRef.detectChanges();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                this.dataSource = null;
                this.ELEMENT_DATA = [];
                if (baseResponse.Success === true) {
                    console.log(baseResponse);
                    this.loading = false;
                    this.Mydata = baseResponse.Loan.ReschedulingSearch;

                    for (let data in this.Mydata) {
                        this.ELEMENT_DATA.push({
                            branch: this.Mydata[data].OrgUnitName,
                            transactionDate: this.Mydata[data].WorkingDate,
                            loanApp: this.Mydata[data].LoanCaseNo,
                            glDescription: this.Mydata[data].GlDesc,
                            status: this.Mydata[data].StatusName,
                            scheme: this.Mydata[data].SchemeCode,
                            oldDate: this.Mydata[data].LastDueDate,
                            acStatus: this.Mydata[data].DisbStatusName,
                        });
                    }

                    this.dataSource = new MatTableDataSource(this.ELEMENT_DATA);
                    console.log(this.dataSource.data);
                    if (this.dataSource.data.length > 0)
                        this.matTableLenght = true;
                    else this.matTableLenght = false;

                    this.dv = this.dataSource.filteredData;

                    this.totalItems = this.dataSource.filteredData.length;
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                    //console.log(this.dataSource.filteredData.length)
                    //console.log(this.dataSource.data.length)
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
                this.loading = false;
            });
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.pageIndex = pageIndex;
        this.OffSet = pageIndex;
        //this.SearchJvData();
        //this.dv.slice(event * this.itemsPerPage - this.itemsPerPage, event * this.itemsPerPage);
        this.dataSource = this.dv.slice(
            pageIndex * this.itemsPerPage - this.itemsPerPage,
            pageIndex * this.itemsPerPage
        ); //slice is used to get limited amount of data from APi
    }
}

interface SearchRC {
    branch: string;
    transactionDate: string;
    loanApp: string;
    glDescription: string;
    status: string;
    scheme: string;
    oldDate: string;
    acStatus: string;
}

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {Lov} from 'app/shared/classes/lov.class';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {SearchLoanCaseByCnic} from '../class/reports';
import {ReportsService} from '../service/reports.service';
import {ToastrService} from "ngx-toastr";
import {Activity} from "../../../shared/models/activity.model";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-get-unsuccessful-login',
    templateUrl: './get-unsuccessful-login.component.html',
    styleUrls: ['./get-unsuccessful-login.component.scss']
})
export class GetUnsuccessfulLoginComponent implements OnInit, AfterViewInit {
    displayedColumns = ['PPNO', 'Zone', 'Branch', 'Employee', 'EmployeeGroup', 'EmployeeLocation', 'IP', 'Date'];
    searchCnicForm: FormGroup;
    loaded = true;
    public reports = new SearchLoanCaseByCnic();
    dataSource: MatTableDataSource<searchLoanCasesByCnic>

    matTableLenght = false;
    loading = false;

    itemsPerPage = 10;
    pageIndex = 1;
    totalItems: number | any;
    dv: number | any; //use later
    gridHeight: string;

    LoggedInUserInfo: BaseResponseModel;

    user: any = {}
    statusLov: any;
    public LovCall = new Lov();
    currentActivity: Activity;
    private branch: any;
    private zone: any;
    private circle: any;

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
        this.currentActivity = this.userUtilsService.getActivity('Get Unsuccessful Login')
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();
        this.searchCnicForm.controls['PPNo'].setValue(this.LoggedInUserInfo.User.UserName)
        // this.typeLov();

    }

    createForm() {
        this.searchCnicForm = this.fb.group({
            PPNo: [null]
        })
    }


    find() {

        if (this.searchCnicForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.searchCnicForm.markAllAsTouched()
            return;
        }


        this.reports = Object.assign(this.reports, this.searchCnicForm.value);
        this.reports.ReportsNo = "24";
        this.spinner.show();
        this._reports.reportDynamic(this.reports, this.zone, this.branch)
            .pipe(
                finalize(() => {
                    this.loaded = true;
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    window.open(environment.apiUrl+"/documents/"+baseResponse.ReportsFilterCustom.FilePath, 'Download');
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.pageIndex = pageIndex;
        //this.OffSet = pageIndex;

        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
    }


    ngAfterViewInit() {

        this.gridHeight = window.innerHeight - 335 + 'px';
    }


}

interface searchLoanCasesByCnic {
    LcNo: string;
}

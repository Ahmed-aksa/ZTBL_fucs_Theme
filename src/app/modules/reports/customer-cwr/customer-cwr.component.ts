import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {SearchLoanCaseByCnic} from "../class/reports";
import {MatTableDataSource} from "@angular/material/table";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Lov} from "../../../shared/classes/lov.class";
import {ReportsService} from "../service/reports.service";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {LovService} from "../../../shared/services/lov.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {ToastrService} from "ngx-toastr";
import {finalize} from "rxjs/operators";

@Component({
    selector: 'app-customer-cwr',
    templateUrl: './customer-cwr.component.html',
    styleUrls: ['./customer-cwr.component.scss']
})
export class CustomerCwrComponent implements OnInit, AfterViewInit {
    displayedColumns = ['Booklet', 'Lcno', 'Date', 'Cnic', 'Name', 'f_name', 'f_size', 'f_no', 'Action'];
    searchCnicForm: FormGroup;
    loaded = true;
    public reports = new SearchLoanCaseByCnic();

    matTableLenght = false;
    loading = false;

    itemsPerPage = 10;
    pageIndex = 1;
    totalItems: number | any;
    dv: number | any; //use later
    gridHeight: string;

    dataSource: MatTableDataSource<searchLoanCasesByCnic>;

    LoggedInUserInfo: BaseResponseModel;

    user: any = {}
    statusLov: any;
    public LovCall = new Lov();
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

        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();

    }

    createForm() {
        this.searchCnicForm = this.fb.group({
            Cnic: [null],
            BookletNo: [null],
            LcNO: [null]
        })
    }


    find() {

        if (this.searchCnicForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.searchCnicForm.markAllAsTouched()
            return;
        }

        if ((this.searchCnicForm.controls.Cnic.value == null || this.searchCnicForm.controls.Cnic.value == '') && (this.searchCnicForm.controls.BookletNo.value == null || this.searchCnicForm.controls.BookletNo.value == '') && (this.searchCnicForm.controls.LcNO.value == null || this.searchCnicForm.controls.LcNO.value == '')) {
            this.layoutUtilsService.alertElement('', 'Please add Cnic, LA/Booklet or Loan Case Number');
            return
        }

        this.reports = Object.assign(this.reports, this.searchCnicForm.value);
        this.reports.ReportsNo = "15";
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

                    this.loading = true;

                    this.dataSource = baseResponse.ReportsFilterCustom.CustomersLegalHiers
                    this.dv = this.dataSource;
                    this.matTableLenght = true

                    this.totalItems = baseResponse.ReportsFilterCustom.SamNplLoans[0].TotalRecords
                } else {

                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    this.loading = false;
                    this.matTableLenght = false;
                    this.dataSource = null;
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


    ngAfterViewInit() {

        this.gridHeight = window.innerHeight - 335 + 'px';
    }

    downloadCusCwr(report) {
        console.log(report)
    }


}

interface searchLoanCasesByCnic {
    LcNo: string;
}

import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
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
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-get-customer-legal-heirs',
    templateUrl: './get-customer-legal-heirs.component.html',
    styleUrls: ['./get-customer-legal-heirs.component.scss']
})
export class GetCustomerLegalHeirsComponent implements OnInit, AfterViewInit {
    displayedColumns = ['Cnic', 'Name', 'Passbook', 'Mutation', 'Occupation', 'Date'];
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
            LcNO: [null, Validators.required]
        })
    }


    find() {

        if (this.searchCnicForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.searchCnicForm.markAllAsTouched()
            return;
        }


        this.reports = Object.assign(this.reports, this.searchCnicForm.value);
        this.reports.ReportsNo = "28";
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

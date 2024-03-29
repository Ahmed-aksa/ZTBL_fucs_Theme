/* eslint-disable max-len */
/* eslint-disable arrow-parens */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable no- */
/* eslint-disable eol-last */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable eqeqeq */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatTableDataSource} from '@angular/material/table';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {SearchLoanCaseByCnic} from '../class/reports';
import {ReportsService} from '../service/reports.service';
import {ToastrService} from "ngx-toastr";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'search-loan-cases-by-cnic',
    templateUrl: './search-loan-cases-by-cnic.component.html',
    styleUrls: ['./search-loan-cases-by-cnic.component.scss']
})
export class SearchLoanCasesByCnicComponent implements OnInit {
    displayedColumns = ['Cnic', 'Name', 'FatherName', 'Address', 'Lcno', 'Agps', 'Bcl', 'Los'];
    searchCnicForm: FormGroup;
    loaded = true;
    public reports = new SearchLoanCaseByCnic();

    matTableLenght = false;
    loading = false;

    itemsPerPage = 10;
    pageIndex = 1;
    totalItems: number | any;
    dv: number | any; //use later

    dataSource: MatTableDataSource<searchLoanCasesByCnic>;

    LoggedInUserInfo: BaseResponseModel;

    SelectedZones: any = [];

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
            Name: [null],
            FatherName: [null]
        })
    }


    find() {

        if (this.searchCnicForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.searchCnicForm.markAllAsTouched()
            return;
        }

        if ((this.searchCnicForm.controls.Cnic.value == null || this.searchCnicForm.controls.Cnic.value == '') && (this.searchCnicForm.controls.Name.value == null || this.searchCnicForm.controls.Name.value == '') && (this.searchCnicForm.controls.FatherName.value == null || this.searchCnicForm.controls.FatherName.value == '')) {
            this.layoutUtilsService.alertElement('', 'Atleast add any one field among Cnic, Father Name or Customer Name')
            return
        }
        this.reports = Object.assign(this.reports, this.searchCnicForm.value);
        this.reports.ReportsNo = "14";
        this.spinner.show();
        this._reports.reportDynamic(this.reports, this.zone, this.branch)
            .pipe(
                finalize(() => {
                    this.loaded = true;
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: any) => {
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
        this.circle = null
    }
}

interface searchLoanCasesByCnic {
    LcNo: string;
}

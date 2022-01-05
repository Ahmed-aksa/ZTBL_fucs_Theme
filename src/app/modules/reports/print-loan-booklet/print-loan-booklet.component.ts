import {AfterViewInit, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Bufrication} from "../class/reports";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {LovService} from "../../../shared/services/lov.service";
import {ReportsService} from "../service/reports.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";
import {Lov} from "../../../shared/classes/lov.class";
import {finalize} from "rxjs/operators";
import {MatTableDataSource} from "@angular/material/table";

@Component({
  selector: 'app-print-loan-booklet',
  templateUrl: './print-loan-booklet.component.html',
  styleUrls: ['./print-loan-booklet.component.scss']
})
export class PrintLoanBookletComponent implements OnInit,AfterViewInit {
    displayedColumns = ['Sr', 'Description','DocumentType', 'Print'];
    dataSource: MatTableDataSource<any>;
    bufricationForm: FormGroup;
    gridHeight: any;
    table = false;
    loaded = true;
    LoggedInUserInfo: BaseResponseModel;
    statusLov: any;
    loading = false;
    bookletDetail:any;

    public reports = new Bufrication();


    //Zone inventory

    branch: any;
    zone: any;
    circle: any;


    user: any = {}

    constructor(
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private _lovService: LovService,
        private _bufrication: ReportsService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService,
        private _reports: ReportsService,
    ) {
    }

    public LovCall = new Lov();

    ngOnInit(): void {
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();
    }


    createForm() {
        this.bufricationForm = this.fb.group({
            LcNO: [null, Validators.required],
        })
    }


    find() {

        if (this.bufricationForm.invalid) {
            this.toastr.error("Please Enter Required values");
            this.bufricationForm.markAllAsTouched();
            return;
        }
        this.reports = Object.assign(this.reports, this.bufricationForm.value);
        this.reports.ReportsNo = "29";
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
                    this.bookletDetail = baseResponse.ReportsFilterCustom.BookletCustomerInfo;
                    this.dataSource = baseResponse.ReportsFilterCustom.LoanBookletList;
                    this.table = true;
                    //window.open(baseResponse.ReportsFilterCustom.FilePath, 'Download');
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }

    print(){}

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = null;
    }

    ngAfterViewInit() {
        this.gridHeight = window.innerHeight - 335 + 'px';
    }

}

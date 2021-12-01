import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {Customer, Documents, MarkDeceasedCustomer} from "../../../shared/models/deceased_customer.model";
import {MatTableDataSource} from "@angular/material/table";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {CircleService} from "../../../shared/services/circle.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {DeceasedCustomerService} from "../../../shared/services/deceased-customer.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CommonService} from "../../../shared/services/common.service";
import {DatePipe} from "@angular/common";
import {finalize} from "rxjs/operators";
import {ViewFileComponent} from "../../deceased-customer/view-file/view-file.component";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";

@Component({
    selector: 'app-eligibility-logs',
    templateUrl: './eligibility-logs.component.html',
    styleUrls: ['./eligibility-logs.component.scss'],
    providers: [
        DatePipe,
        {provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE]},
        {provide: MAT_DATE_FORMATS, useValue: DateFormats},
        {
            provide: MatDialogRef,
            useValue: {}
        },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {}
        },
    ],
})
export class EligibilityLogsComponent implements OnInit {


    customerForm: FormGroup;
    //matElects: FormGroup;

    displayedColumns = [
        "ZoneName",
        "BranchName",
        "CircleName",
        "CNIC",
        "BMVSStatus",
        "NIVSStatus",
        "NDCStatus",
        "CWRStatus",
        "CreatedDate"];

    eligibility_log: FormGroup;
    branch: any;
    zone: any;
    circle: any;
    dataSource = new MatTableDataSource;
    offset: number = 0;
    pageIndex: number = 0;
    TotalRecords: number;
    items_per_page: number = 5;


    constructor(
        private fb: FormBuilder,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private userUtilsService: UserUtilsService,
        private cdRef: ChangeDetectorRef,
        private _circleService: CircleService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private dialog: MatDialog,
        private route: ActivatedRoute,
        private _common: CommonService,
        private datePipe: DatePipe,
    ) {
    }

    ngOnInit() {
        this.createForm();
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }

    createForm() {


        this.eligibility_log = this.fb.group({
            Cnic: [""],
        });
    }

    find(is_first = false) {
        if (is_first) {
            this.offset = 0;
        }
        if (!this.zone) {
            this.layoutUtilsService.alertMessage("", "Please enter Zone");
            return;
        }
        let request = {
            Cnic: this.eligibility_log.value.Cnic
        };
        let final_request = {
            EligibilityRequest: request,
            Branch: this.branch,
            Zone: this.zone,
            Circle: {
                CircleCode: this.circle?.Id
            },
            Pagination: {
                Limit: this.items_per_page,
                Offset: this.offset
            }
        }
        this.userUtilsService.getEligibilityLogs(final_request).subscribe((data: any) => {
            if (data.Success) {
                this.dataSource.data = data.EligibilityRequest.EligibilityRequests;
                this.TotalRecords = data.EligibilityRequest.EligibilityRequests[0]?.TotalRecords;
            } else {
                this.layoutUtilsService.alertMessage("", data.Message);
            }
        })
    }

    paginate(pageIndex: any, pageSize: any = this.items_per_page) {
        debugger;
        if (Number.isNaN(pageIndex)) {
            this.pageIndex = this.pageIndex + 1;
        } else {
            this.pageIndex = pageIndex;
        }
        this.items_per_page = pageSize;
        this.offset = (this.pageIndex - 1) * this.items_per_page;

        this.find();


    }

    MathCeil(number: number) {
        return Math.ceil(number);
    }
}

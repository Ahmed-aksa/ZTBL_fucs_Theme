import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {CircleService} from "../../../shared/services/circle.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {CommonService} from "../../../shared/services/common.service";
import {DatePipe} from "@angular/common";
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";
import {EligibilityLogDetailComponent} from "../eligibility-log-detail/eligibility-log-detail.component";
import {ViewMapsComponent} from "../../../shared/component/view-map/view-map.component";

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
        "BranchWorkingDate",
        "CreatedDate",
        "Actions"
    ];

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
        this.spinner.show();
        this.userUtilsService.getEligibilityLogs(final_request).subscribe((data: any) => {
            this.spinner.hide();
            if (data.Success) {
                this.dataSource.data = data.EligibilityRequest.EligibilityRequests;
                this.TotalRecords = data.EligibilityRequest.EligibilityRequests[0]?.TotalRecords;
            } else {
                this.layoutUtilsService.alertMessage("", data.Message);
                this.dataSource.data = this.dataSource.data.splice(1, 0)

            }
        })
    }

    paginate(pageIndex: any, pageSize: any = this.items_per_page) {
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

    viewDetail(EligibilityLog) {
        let eligibility_log_detail: any = null;
        if (!this.zone) {
            this.layoutUtilsService.alertMessage("", "Please enter Zone");
            return;
        }
        let request = {
            Id: EligibilityLog
        };
        let final_request = {
            EligibilityRequest: request,
            Branch: this.branch,
            Zone: this.zone,
            Circle: {
                CircleCode: this.circle?.Id
            },
        }
        this.spinner.show();
        this.userUtilsService.getEligibilityLogById(final_request).subscribe((data: any) => {
            this.spinner.hide();
            if (data.Success) {
                eligibility_log_detail = data.EligibilityRequest;
                const dialogRef = this.dialog.open(EligibilityLogDetailComponent, {
                    data: {eligibility_log_detail},
                    width: '80%',
                    height: '80%',
                    panelClass: ['h-screen', 'max-w-full', 'max-h-half', 'provide-margin-top'],
                })
            } else {
                this.layoutUtilsService.alertMessage("", data.Message);
            }
        })


    }

    showLocation(EligibilityLog) {
        let data = {
            Lat: EligibilityLog.Lat,
            Lng: EligibilityLog.Lng
        };
        const dialogRef = this.dialog.open(ViewMapsComponent, {
            panelClass: ['h-screen', 'max-w-full', 'max-h-full'],
            width: '100%',
            data: data,
            disableClose: true
        });
    }
}

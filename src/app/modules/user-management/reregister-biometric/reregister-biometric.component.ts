import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {MatTableDataSource} from "@angular/material/table";
import {NgxSpinnerService} from "ngx-spinner";
import {ReportsService} from "../services/reports.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {finalize} from "rxjs/operators";
import {BaseResponseModel} from "../../../shared/models/base_response.model";

@Component({
    selector: 'app-reregister-biometric',
    templateUrl: './reregister-biometric.component.html',
    styleUrls: ['./reregister-biometric.component.scss']
})
export class ReregisterBiometricComponent implements OnInit {
    dataSource = new MatTableDataSource();
    reregister_biometric_form: FormGroup;
    zone: any;
    branch: any;
    circle: any;
    dv: number | any; //use later

    total_requests_length: number | any;
    displayedColumns = [
        'PPNO',
        'Details',
        'Action',
    ];
    itemsPerPage = 5;
    OffSet: number = 0;
    pageIndex: any = 0;


    loading: boolean = false;

    constructor(private fb: FormBuilder, private spinner: NgxSpinnerService, private reportsService: ReportsService, private layoutUtilsService: LayoutUtilsService) {
    }

    ngOnInit(): void {
        this.createForm();
        this.getRequests(true);

    }


    createForm() {
        this.reregister_biometric_form = this.fb.group({
            "PPNO": []
        });
    }

    getRequests(first = false) {
        this.spinner.show();
        if (first) {
            this.OffSet = 0;
        }
        this.reportsService.getBiometricRegistrationRequest(this.itemsPerPage, this.OffSet, this.reregister_biometric_form.value.PPNO).subscribe((baseResponse) => {
            this.spinner.hide();
            if (baseResponse.Success) {
                this.dataSource.data = baseResponse?.BiometricRequests;
                if (this.dataSource.data && this.dataSource.data?.length > 0) {
                    this.dv = this.dataSource.data;
                    this.total_requests_length = baseResponse.BiometricRequests[0].TotalRecords;
                    this.dataSource = this.dv?.splice(0, this.itemsPerPage);
                }


            } else {
                this.layoutUtilsService.alertElement("", baseResponse.Message);
                this.OffSet = 1;
                this.pageIndex = 1;
                this.dataSource = this.dv?.splice(1, 0);
                this.total_requests_length = 0;
            }
        });
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }

    MathCeil(value: any) {
        return Math.ceil(value);
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        if (Number.isNaN(pageIndex)) {
            this.pageIndex = this.pageIndex + 1;
        } else {
            this.pageIndex = pageIndex;
        }
        this.itemsPerPage = pageSize;
        this.OffSet = (this.pageIndex - 1) * this.itemsPerPage;
        if (this.OffSet < 0) {
            this.OffSet = 0;
        }
        this.getRequests();
    }

    changeStatus(status: string, ppno: number) {
        let _title = "Confirmation?";
        let _description = "";
        if (status == 'A') {
            _description = "Do you really want to Allow this request?";
        } else {
            _description = "Do you really want to Reject this request?";
        }

        const dialogRef = this.layoutUtilsService.AlertElementConfirmation(_title, _description);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.spinner.show();

            this.loading = true;
            this.reportsService.changeBiometricReportsStatus(status, ppno)
                .pipe(
                    finalize(() => {
                        this.loading = false;
                        this.spinner.hide();
                    })
                )
                .subscribe((baseResponse: BaseResponseModel) => {
                    if (baseResponse.Success === true) {
                        this.layoutUtilsService.alertElementSuccess("Success", baseResponse.Message);
                        this.getRequests(true);
                    } else {
                        this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                    }

                });

        });
    }
}

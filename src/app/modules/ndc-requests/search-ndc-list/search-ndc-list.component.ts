/* eslint-disable no-trailing-spaces */
/* eslint-disable space-before-function-paren */
/* eslint-disable arrow-parens */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable prefer-const */
/* eslint-disable eqeqeq */
/* eslint-disable no- */
/* eslint-disable no-var */
/* eslint-disable one-var */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable curly */
/* eslint-disable @typescript-eslint/explicit-function-return-type */

import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild,} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatSort} from '@angular/material/sort';
import {MatPaginator} from '@angular/material/paginator';
import {MatTableDataSource} from '@angular/material/table';
import {finalize} from 'rxjs/operators';
import {LayoutUtilsService} from '../../../shared/services/layout_utils.service';
import {NdcRequestsService} from '../Services/ndc-requests.service';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {HttpClient} from '@angular/common/http';
import {CircleService} from '../../../shared/services/circle.service';
import {Router} from '@angular/router';
import {ViewMapsComponent} from "../../../shared/component/view-map/view-map.component";
import {Activity} from "../../../shared/models/activity.model";
import {environment} from "../../../../environments/environment";

@Component({
    selector: 'app-search-ndc-list',
    templateUrl: './search-ndc-list.component.html',
    styleUrls: ['./search-ndc-list.component.scss'],
})
export class SearchNdcListComponent implements OnInit {
    request_data_source = new MatTableDataSource();
    pending_requests_data_source = new MatTableDataSource();
    dataSource = new MatTableDataSource();
    displayedColumns = [
        'EmployeeNo',
        'EmployeeName',
        'PhoneNumber',
        'Email',
        'ZoneName',
        'BranchName',
        'UserCircles',
        'actions',
    ];
    ndc_requests_displayed_columns = [
        'Id',
        'customer_cnic',
        'name',
        'current_status',
        'last_status',
        'next_action_by',
        'request_by',
        'request_on',
        'actions',
    ];
    pending_ndc_requests_displayed_columns = [
        'customer_cnic',
        'customer_name',
        'request_on',
    ];
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;
    gridHeight: string;
    selected_b;
    hasSrNo: boolean = false;
    hide = true;
    LoggedInUserInfo: BaseResponseModel;

    ndcForm: FormGroup;
    branch: any;
    zone: any;
    circle: any;
    pageSize = 10;
    pageSizePending = 10;
    ndcLength: number;
    pendingLength: number;
    pageSizeOptions = [10, 25, 50];
    offSet = 0;
    count = 1;
    user: any = {};
    pageIndex = 1;
    pageIndexPending = 1;

    dvReq: any;
    dvPending: any;
    Math: any;
    public Zone = new Zone();

    SrNo: number | any;
    isUserAdmin: boolean = false;
    currentActivity: Activity;
    Num: any;
    private _cdf: ChangeDetectorRef;
    private loggedInUserDetails: any;

    constructor(
        public dialog: MatDialog,
        private router: Router,
        private ndc_request_service: NdcRequestsService,
        private layoutUtilsService: LayoutUtilsService,
        private fb: FormBuilder,
        private _circleService: CircleService,
        private spinner: NgxSpinnerService,
        private userUtilsService: UserUtilsService,
        private http: HttpClient
    ) {
        this.Math = Math;
    }

    ngOnInit() {
        this.currentActivity = this.userUtilsService.getActivity('Search NDC List')
        this.createForm();
        if (this.hasSrNo != true) {
            this.ndc_requests_displayed_columns = [
                'customer_cnic',
                'name',
                'current_status',
                'last_status',
                'next_action_by',
                'request_by',
                'request_on',
                'actions',
            ];
        }
    }

    createForm() {
        this.ndcForm = this.fb.group({
            ZoneId: [null],
            BranchId: [null],
            CircleId: [null],
            Cnic: [null],
        });
    }

    refreshForm() {
        this.ndcForm = this.fb.group({
            Cnic: [null],
        });
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    loadUsersList() {
        this.user.ZoneId = this.ndcForm.controls.ZoneId.value;
        this.user.BranchId = this.ndcForm.controls.BranchId.value;
        this.user.CircleId = this.ndcForm.controls.CircleId.value;
        this.user.Cnic = this.ndcForm.controls.Cnic.value;


        this.spinner.show();
        this.loading = true;
        this.ndc_request_service
            .getRequests(
                this.user,
                this.pageSize,
                this.offSet,
                this.zone,
                this.branch
            )
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: any) => {
                if (baseResponse.Success) {
                    this.request_data_source = baseResponse.Ndc.Ndcrequests;
                    if (this.request_data_source[0].srNo != undefined) {
                        this.hasSrNo = true;
                    }
                    this.dvReq = this.request_data_source;
                    this.ndcLength = this.dvReq.length;
                    this.request_data_source = this.dvReq.slice(
                        0,
                        this.pageSize
                    );

                    if (baseResponse.Ndc.pendingNdcs != null) {
                        this.pending_requests_data_source =
                            baseResponse.Ndc.pendingNdcs;
                        this.dvPending = this.pending_requests_data_source;
                        this.pendingLength = this.dvPending.length;
                        this.pending_requests_data_source =
                            this.dvPending.slice(0, this.pageSize);
                        // this.pending_requests_data_source.paginator = this.paginator;
                        // this.pendingLength = baseResponse.Ndc.pendingNdcs.length;
                    }
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                    this.request_data_source = this.dvReq.splice(1, 0);
                    this.pending_requests_data_source = this.dvPending.splice(1, 0)
                }
            });
    }

    DeleteUser(request: any) {
        this.user.NDCId = request.NDCId;
        this.user.CircleId = request.CircleId;
        this.user.Remarks = request.MCORemarks;

        // this.user.BranchCode = this.ndcForm.controls.BranchCode.value

        this.ndc_request_service
            .DeleteCustomer(this.user)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: any) => {
                if (baseResponse.Success) {
                    this.layoutUtilsService.alertElementSuccess(
                        '',
                        baseResponse.Message
                    );
                    window.location.reload();
                }
            });
    }

    // findCnic(cnic: HTMLInputElement) {
    //   this.loadUsersList(cnic.value);
    // }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 300 + 'px';
    }

    findCnic() {
        this.loadUsersList();
    }

    checkMap(data) {
        if (data?.Lat?.length > 0) {
            return true;
        } else {
            return false;
        }
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }

    viewMap(data) {
        const dialogRef = this.dialog.open(ViewMapsComponent, {
            panelClass: ['h-screen', 'max-w-full', 'max-h-full'],
            width: '100%',
            data: data,
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
        });
    }

    downloadFile(customer_cnic, customer_id) {

        this.spinner.show();
        this.ndc_request_service
            .downloadFile(
                customer_cnic,
                customer_id,
                this.pageSize,
                (this.offSet = 0),
                this.user
            )
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                    this.loading = false;
                })
            )
            .subscribe((baseResponse: any) => {
                if (baseResponse.Success) {

                    // var path = baseResponse.Ndc.ndcFilePath,
                    //     str;
                    // path = path.split('TempReport');
                    // str = path.splice(0, 1, 0);
                    // str = String(str);
                    //
                    //this.router.navigateByUrl(baseResponse.Ndc.ndcFilePath)

                    window.open(environment.apiUrl+"/"+baseResponse.Ndc.ndcFilePath, 'Download');

                    this.layoutUtilsService.alertElementSuccess(
                        '',
                        baseResponse.Message
                    );
                    //window.location.reload()
                    //window.open(`${str}${customer_cnic}_NDC.pdf`,'Download');

                    //this.downloadFile1()
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message
                    );
                }
            });
    }

    downloadFile1(): any {
        alert('dsds');
        return this.http.get(
            'http://172.16.1.228/ZtblDocument/ndc_Request/TempReport_011121020540.pdf',
            {responseType: 'blob'}
        );
    }

    paginateRequest(pageIndex: any, pageSize: any = this.pageSize) {
        if (pageSize)
            for (var i = 1; i >= pageSize; i++) {
                this.Num.push(i++);
            }
        this.pageSize = pageSize;
        this.pageIndex = pageIndex;
        this.offSet = pageIndex;

        this.request_data_source = this.dvReq.slice(
            pageIndex * this.pageSize - this.pageSize,
            pageIndex * this.pageSize
        ); //slice is used to get limited amount of data from APi
    }

    paginatePending(pageIndex: any, pageSize: any = this.pageSize) {
        this.pageSizePending = pageSize;
        this.pageIndexPending = pageIndex;
        this.offSet = pageIndex;

        this.pending_requests_data_source = this.dvPending.slice(
            pageIndex * this.pageSize - this.pageSize,
            pageIndex * this.pageSize
        ); //slice is used to get limited amount of data from APi
    }

    submitDeleteStatus(request) {
        if (
            request.Status == 'Submitted' ||
            request.Status == 'Pending for approval' ||
            request.Status == 'ReferBack'
        ) {
            return true;
        } else {
            return false;
        }
    }

    submitSubmitStatus(request) {
        if (request.Status == 'Submitted' || request.Status == 'ReferBack') {
            return true;
        } else {
            return false;
        }
    }


    SubmitUser(request) {
        this.user.NDCId = request.NDCId;
        this.user.CircleId = request.CircleId;
        this.user.Remarks = request.MCORemarks;

        // this.user.BranchCode = this.ndcForm.controls.BranchCode.value

        this.ndc_request_service
            .SubmitUser(this.user)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: any) => {
                if (baseResponse.Success) {
                    this.layoutUtilsService.alertElementSuccess(
                        '',
                        baseResponse.Message
                    );
                    window.location.reload();
                }
            });
    }

    refresh() {
        this.ndcForm.controls['Cnic'].setValue('');
        this.loadUsersList();
    }
}

export class Zone {
    ZoneId: number;
    ZoneName: string;
}

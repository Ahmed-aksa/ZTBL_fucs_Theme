import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {GeoFencingService} from '../service/geo-fencing-service.service';
import {MatDialog} from '@angular/material/dialog';
import {LayoutUtilsService} from '../../../shared/services/layout_utils.service';
import {UserUtilsService} from '../../../shared/services/users_utils.service';
import {BaseResponseModel} from '../../../shared/models/base_response.model';
import {MatTableDataSource} from '@angular/material/table';

import {finalize} from 'rxjs/operators';
import {ViewGetFancingModalComponent} from '../view-get-fancing-modal/view-get-fancing-modal.component';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {PaginatorService} from "../../../shared/services/paginator.service";
import {Activity} from "../../../shared/models/activity.model";

@Component({
    selector: 'app-geo-fencing-list',
    templateUrl: './geo-fencing-list.component.html',
    styleUrls: ['./geo-fencing-list.component.scss'],
})
export class GeoFencingListComponent implements OnInit {
    disable_branch = true;

    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    gridHeight: string;
    products: any;
    displayedColumns = [
        'CircleCodes',
        'PPNo',
        'BranchCode',
        'StartTime',
        'StopTime',
        'ApproxDistanceTraveled',
        'View',
    ];
    itemsPerPage = 5;
    pageIndex = 1;
    offSet = 0;
    totalItems: number | any = 0;
    dv: number | any; //use later
    dataSource = new MatTableDataSource();
    listForm: FormGroup;
    //Zone inventory
    LoggedInUserInfo: BaseResponseModel;
    user: any = {};
    zone: any;
    branch: any;
    circle: any;
    currentActivity: Activity

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private activatedRoute: ActivatedRoute,
        private _geoFencingService: GeoFencingService,
        private dialog: MatDialog,
        private layoutUtilsService: LayoutUtilsService,
        private userUtilsService: UserUtilsService,
        private spinner: NgxSpinnerService,
        private paginationService: PaginatorService
    ) {
    }

    ngOnInit(): void {
        this.currentActivity = this.userUtilsService.getActivity('Geo Fencing List')
        this.createForm();
    }

    createForm() {
        this.listForm = this.fb.group({
            PPNo: [null],
            StartDate: [null, [Validators.required]],
            EndDate: [null, [Validators.required]],
        });
    }

    find() {
        this.SearchGeoFencePoint(true);
    }

    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 400 + 'px';
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {

        if (Number.isNaN(pageIndex)) {
            this.pageIndex = this.pageIndex + 1;
        } else {
            this.pageIndex = pageIndex;
        }
        this.itemsPerPage = pageSize;
        this.offSet = (this.pageIndex - 1) * this.itemsPerPage;
        this.SearchGeoFencePoint();


    }

    SearchGeoFencePoint(is_first = false) {
        if (is_first) {
            this.offSet = 0;
        }
        var request = {
            LocationHistory: {
                Limit: this.itemsPerPage,
                Offset: this.offSet,
                PPNo: this.listForm.controls.PPNo.value,
                StartDate: this.listForm.controls.StartDate.value,
                EndDate: this.listForm.controls.EndDate.value,
            },
            Circle: this.circle,
            Zone: this.zone,
            Branch: this.branch,
        };
        this.spinner.show();
        this._geoFencingService
            .SearchGeoFencePoint(request)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                this.spinner.hide();

                if (baseResponse.Success === true) {
                    this.dataSource.data =
                        baseResponse.LocationHistory.LocationHistories;
                    this.totalItems = baseResponse.LocationHistory.LocationHistories[0].TotalRecords;
                    this.dv = this.dataSource.data;
                } else {
                    this.dataSource.data = [];
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message
                    );
                }
            });
    }

    view(data: any) {
        const dialogRef = this.dialog.open(ViewGetFancingModalComponent, {
            panelClass: ['h-screen', 'max-w-full', 'max-h-full', 'location-box'],
            width: '100%',
            data: data,
            disableClose: true,
        });
        dialogRef.afterClosed().subscribe((res) => {
            if (!res) {
                return;
            }
        });
    }

    comparisonEnddateValidator(): any {
        let ldStartDate = this.listForm.value['StartDate'];
        let ldEndDate = this.listForm.value['EndDate'];

        let startnew = new Date(ldStartDate);
        let endnew = new Date(ldEndDate);
        if (startnew > endnew) {
            return this.listForm.controls['EndDate'].setErrors({
                invaliddaterange: true,
            });
        }

        let oldvalue = startnew;
        this.listForm.controls['StartDate'].reset();
        this.listForm.controls['StartDate'].patchValue(oldvalue);
        return this.listForm.controls['StartDate'].setErrors({
            invaliddaterange: false,
        });
    }

    comparisonStartdateValidator(): any {
        let ldStartDate = this.listForm.value['StartDate'];
        let ldEndDate = this.listForm.value['EndDate'];

        let startnew = new Date(ldStartDate);
        let endnew = new Date(ldEndDate);
        if (startnew > endnew) {
            return this.listForm.controls['StartDate'].setErrors({
                invaliddaterange: true,
            });
        }

        let oldvalue = endnew;
        this.listForm.controls['EndDate'].reset();
        this.listForm.controls['EndDate'].patchValue(oldvalue);
        return this.listForm.controls['EndDate'].setErrors({
            invaliddaterange: false,
        });
    }

    hasError(controlName: string, errorName: string): boolean {
        return this.listForm.controls[controlName].hasError(errorName);
    }

    MathCeil(value: any) {
        return Math.ceil(value);
    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = data.final_circle;
    }
}

interface GeoFencingList {
    User: string;
    Type: string;
    Date: string;
}

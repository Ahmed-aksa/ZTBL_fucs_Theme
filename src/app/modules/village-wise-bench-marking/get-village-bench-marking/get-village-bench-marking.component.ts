/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable arrow-parens */
/* eslint-disable no- */
/* eslint-disable prefer-const */
/* eslint-disable eol-last */
/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import {AfterViewInit, ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {MatTableDataSource} from '@angular/material/table';
import {ActivatedRoute, Router} from '@angular/router';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {VillageBenchMark} from '../model/village-benchmark.model';
import {VillageWiseBenchMarkingService} from '../service/village-wise-bench-marking.service';
import {RemarkDialogComponent} from './remark-dialog/remark-dialog.component';
import {ViewMapsComponent} from "../../../shared/component/view-map/view-map.component";
import {Activity} from "../../../shared/models/activity.model";

@Component({
    selector: 'app-get-village-bench-marking',
    templateUrl: './get-village-bench-marking.component.html',
    styleUrls: ['./get-village-bench-marking.component.scss']
})
export class GetVillageBenchMarkingComponent implements OnInit, AfterViewInit {

    displayedColumns = ['CircleCode', 'VillageName', 'FarmSize', 'NoOfFarmer', 'MaleCount', 'FemaleCount', 'TransGenderCount', 'AverageLoanSize', 'AgriBusinessPotential', 'Delete'];

    loggedInUserDetails: any;
    getVillageBenchmarkForm: FormGroup;

    dv;
    itemsPerPage = 10;
    totalItems;
    pageIndex = 1;
    gridHeight: string;
    Offset: number = 0;
    Limit;

    Math: any;

    getVillage: any = {};

    matTableLenght: boolean = false;
    LoggedInUserInfo: BaseResponseModel;
    loaded = false;
    dataSource: MatTableDataSource<VillageBenchMark>

    zone: any;
    branch: any;
    circle: any;
    currentActivity: Activity

    constructor(
        private layoutUtilsService: LayoutUtilsService,
        private router: Router,
        private _villageBenchmark: VillageWiseBenchMarkingService,
        private activatedRoute: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
        private userUtilsService: UserUtilsService,
        private dialog: MatDialog
    ) {
        this.Math = Math;
    }

    ngAfterViewInit() {


        this.gridHeight = window.innerHeight - 200 + 'px';
    }

    ngOnInit() {
        this.currentActivity = this.userUtilsService.getActivity('Get Village Bench Marking')
        var userDetails = this.userUtilsService.getUserDetails();
        this.loggedInUserDetails = userDetails;

        this.createForm();
    }


    createForm() {
        this.getVillageBenchmarkForm = this.fb.group({
            Zone: [null],
            Branch: [null],
            Circle: [null],
            VillageName: [null]
        })
    }

    viewBenchMark(VillageBenchMark: any) {

    }

    find() {
        this.Offset = 0;
        this.itemsPerPage = 10;
        this.search()
    }

    search() {

        this.loaded = false;
        this.Limit = this.itemsPerPage;

        this.getVillage.ZoneId = this.getVillageBenchmarkForm.controls.Zone.value;
        this.getVillage.BranchCode = this.getVillageBenchmarkForm.controls.Branch.value;
        this.getVillage.CircleId = this.getVillageBenchmarkForm.controls.Circle.value;
        this.getVillage.VillageName = this.getVillageBenchmarkForm.controls.VillageName.value;

        this.dataSource = new MatTableDataSource();


        this.spinner.show();
        this._villageBenchmark.getVillageBenchMark(this.circle, this.Limit, this.Offset, this.getVillage, this.zone, this.branch)
            .pipe(
                finalize(() => {
                    this.loaded = true;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {

                    this.dataSource = baseResponse.VillageBenchMarking.VillageBenchMarkingList
                    this.matTableLenght = true
                    this.dv = this.dataSource
                    this.totalItems = baseResponse.VillageBenchMarking.VillageBenchMarkingList[0].TotalRecords;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                } else {
                    this.dataSource.data = []
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    this.loaded = false;
                    this.matTableLenght = false;
                    this.dataSource = this.dv?.slice(1, 0);
                    this.Offset = 0;
                    this.pageIndex = 1;
                }
            })
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {

        this.itemsPerPage = pageSize;

        this.Offset = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.search();
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }

    checkDeleteStatus(benchmark) {
        if (benchmark.CreatedBy == this.loggedInUserDetails?.User?.UserId) {
            return true
        } else {
            return false
        }
    }


    deleteVillageBenchMark(benchmark) {
        this.getVillage = benchmark;

        const dialogRef = this.dialog.open(RemarkDialogComponent, {
            panelClass: 'trend-dialog',
            width: "600px",
            height: "250px",
            data: this.getVillage,
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }
            this.getVillage.Remarks = res;
            //this.spinner.show();
            this._villageBenchmark.deleteVillageBenchmark(this.getVillage)
                .pipe(
                    finalize(() => {
                        //this.spinner.hide();
                    })
                )
                .subscribe((baseResponse: BaseResponseModel) => {
                    if (baseResponse.Success === true) {
                        this.getVillageBenchmarkForm.controls["VillageName"].reset()
                        this.getVillageBenchmarkForm.controls["Circle"].setValue(this.circle?.Id)
                        this.Offset = 0;
                        this.Limit = 10;
                        this.search()
                    }
                })
        });
    }


    checkEditStatus(val) {
        if (val.CreatedBy == this.loggedInUserDetails?.User?.UserId) {
            if (val.Status == "S") {
                return false;
            } else if (val.Status == "P") {
                return true;
            }
        } else {
            return false
        }

    }

    checkViewStatus(val) {
        return true;
        if (val.CreatedBy != this.loggedInUserDetails?.User?.UserId) {
            if (val.Status == "S") {
                return false;
            } else if (val.Status == "P") {
                return true;
            }
        } else {
            return false
        }

    }

    editVillageBenchMark(val) {
        localStorage.setItem('selected_single_zone', JSON.stringify(val.ZoneId));
        localStorage.setItem('selected_single_branch', JSON.stringify(val.BranchCode));
        localStorage.setItem('selected_single_circle', JSON.stringify(val.CircleId));
        this.router.navigate(['/village-wise-bench-marking/add-update-bench-marking'], {
            state: {example: val, hide: true},
            relativeTo: this.activatedRoute
        });
    }

    viewVillageBenchMark(val) {
        localStorage.setItem('selected_single_zone', JSON.stringify(val.ZoneId));
        localStorage.setItem('selected_single_branch', JSON.stringify(val.BranchCode));
        localStorage.setItem('selected_single_circle', JSON.stringify(val.CircleId));

        this.router.navigate(['/village-wise-bench-marking/add-update-bench-marking'], {
            state: {example: val, hide: false},
            relativeTo: this.activatedRoute
        });
    }

    checkMap(data) {
        if (data.Lat.length > 0) {
            return true;
        } else {
            return false;
        }
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


    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }
}

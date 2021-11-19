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

    selected_b;
    selected_z;

    //Zone Inventory
    Zone: any = [];
    SelectedZones: any = [];

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];

    //Circle Inventory
    Circles: any = [];
    SelectedCircles: any = [];

    disable_circle = true;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    single_zone = true;

    loaded = false;

    //dataSource = new MatTableDataSource();
    dataSource: MatTableDataSource<VillageBenchMark>

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

        var userDetails = this.userUtilsService.getUserDetails();
        this.loggedInUserDetails = userDetails;

        this.createForm();
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();

        if (this.LoggedInUserInfo.Branch != null) {


            this.Branches = this.LoggedInUserInfo.Branch;
            this.SelectedBranches = this.Branches;

            this.Zone = this.LoggedInUserInfo.Zone;
            this.SelectedZones = this.Zone;

            this.selected_z = this.SelectedZones.ZoneId
            this.selected_b = this.SelectedBranches.BranchCode
            this.getVillageBenchmarkForm.controls["Zone"].setValue(this.SelectedZones.ZoneName);
            this.getVillageBenchmarkForm.controls["Branch"].setValue(this.SelectedBranches.Name);

            if (this.loggedInUserDetails.UserCircleMappings.length != 0) {
                this.Circles = this.LoggedInUserInfo.UserCircleMappings;
            } else {
                this.changeBranch(this.selected_b);
            }
            this.SelectedCircles = this.Circles;
            this.disable_circle = false;

            var fi: any = []
            fi.Id = "null";
            fi.CircleCode = "All";
            fi.LovId = "0";
            fi.TagName = "0";
            this.SelectedCircles.splice(0, 0, fi)
            this.getVillageBenchmarkForm.controls["Circle"].setValue(this.SelectedCircles ? this.SelectedCircles[0].Id : "")

            this.getVillage.ZoneId = this.getVillageBenchmarkForm.controls.Zone.value;
            this.getVillage.BranchCode = this.getVillageBenchmarkForm.controls.Branch.value;
            this.search()
        } else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.UserCircleMappings && this.LoggedInUserInfo.Zone) {

            this.Zone = this.LoggedInUserInfo.Zone;
            this.SelectedZones = this.Zone;
            this.disable_zone = true;
            this.getVillageBenchmarkForm.controls["Zone"].setValue(this.SelectedZones?.Id);


            this.selected_z = this.SelectedZones?.ZoneId
            this.changeZone(this.selected_z);
        } else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
            this.spinner.show();

            this.userUtilsService.getZone().subscribe((data: any) => {
                this.Zone = data.Zones;
                this.SelectedZones = this.Zone;
                this.single_zone = false;
                this.disable_zone = false;
                this.single_branch = false
                this.spinner.hide();

            });
        }


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

        if (this.getVillage.ZoneId != this.SelectedZones.ZoneId && this.getVillage.BranchCode != this.SelectedBranches.BranchCode) {
            this.getVillage.ZoneId = this.selected_z;
            this.getVillage.BranchCode = this.selected_b;
        }

        this.dataSource = new MatTableDataSource();

        // if (this.getVillage.VillageName != null || this.getVillage.CircleId != null) {
        //   this.Offset = 0;
        // }

        this.spinner.show();
        this._villageBenchmark.getVillageBenchMark(this.SelectedCircles, this.Limit, this.Offset, this.getVillage)
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
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    this.matTableLenght = false;

                    // this.dataSource = this.dv.slice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
                    this.pageIndex = 1;
                    this.Offset = 0;

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
        if (benchmark.CreatedBy == this.LoggedInUserInfo.User.UserId) {
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
                        this.getVillageBenchmarkForm.controls["Circle"].setValue(this.SelectedCircles ? this.SelectedCircles[0].Id : "")
                        this.Offset = 0;
                        this.Limit = 10;
                        this.search()
                    }
                })
        });
    }


    checkEditStatus(val) {
        this.loggedInUserDetails.User.UserId;
        if (val.CreatedBy == this.loggedInUserDetails.User.UserId) {
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
        console.log("vluueee" + JSON.stringify(val))
        this.router.navigate(['/village-wise-bench-marking/add-update-bench-marking'], {
            state: {example: val},
            relativeTo: this.activatedRoute
        });
    }

    changeBranch(changedValue) {
        let changedBranch = null;
        if (changedValue.value) {
            changedBranch = {Branch: {BranchCode: changedValue.value}}
        } else {
            changedBranch = {Branch: {BranchCode: changedValue}}

        }

        this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {
            console.log(data);
            this.Circles = data.Circles;
            this.SelectedCircles = this.Circles;
            var fi: any = []
            fi.Id = "null";
            fi.CircleCode = "All";
            fi.LovId = "0";
            fi.TagName = "0";
            this.SelectedCircles.splice(0, 0, fi)
            this.getVillageBenchmarkForm.controls["Circle"].setValue(this.SelectedCircles ? this.SelectedCircles[0].Id : "")
            this.disable_circle = false;
        });
    }

    changeZone(changedValue) {
        let changedZone = null;
        if (changedValue?.value) {
            changedZone = {Zone: {ZoneId: changedValue.value}}
        } else {
            changedZone = {Zone: {ZoneId: changedValue}}

        }
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.Branches = data.Branches;
            this.SelectedBranches = this.Branches;
            this.single_branch = false;
            this.disable_branch = false;
        });
    }
}

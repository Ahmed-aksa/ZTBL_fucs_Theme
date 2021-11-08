import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {LandInfo} from 'app/shared/models/land-info.model';
import {Zone} from 'app/shared/models/zone.model';
import {ActivatedRoute, Router} from "@angular/router";
import {CircleService} from "../../../shared/services/circle.service";
import {LandService} from "../services/land.service";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {Store} from "@ngrx/store";
import {finalize} from "rxjs/operators";
import {AppState} from "../../../shared/reducers";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {MatTableDataSource} from "@angular/material/table";

@Component({
    selector: 'app-land-history',
    templateUrl: './land-history.component.html',
    styleUrls: ['./land-history.component.scss']
})
export class LandHistoryComponent implements OnInit {
    dataSource = new MatTableDataSource();
    loading: boolean;
    landHistoryList: any;
    LandHistory: any;
    loggedInUserDetails: any;
    Branches: any = [];
    Zones: any = [];
    public LandInfo = new LandInfo();
    public Zone = new Zone();
    displayedColumns = ['BranchCode', 'PassbookNO', 'Cnic', 'CustomerName', 'FatherName', 'IsRedeem', 'StatusDesc', 'View'];
    gridHeight: string;

    constructor(private route: ActivatedRoute,
                private store: Store<AppState>,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private layoutUtilsService: LayoutUtilsService,
                private _snackBar: MatSnackBar,
                private _landService: LandService,
                private userUtilsService: UserUtilsService,
                private _circleService: CircleService,
                private cdRef: ChangeDetectorRef) {
    }

    ngOnInit() {


        var u = new UserUtilsService();
        this.GetZones();
        var userDetails = u.getUserDetails();
        this.loggedInUserDetails = userDetails;
        //this.LandInfo = this.route.landInfo;
        this.LandInfo.Id = this.route.snapshot.params['lID'];
        this.GetLandHistoryData();
    }

    ngAfterViewInit() {
        this.gridHeight = window.innerHeight - 400 + 'px';
    }

    GetZones() {

        this.loading = true;
        this._circleService.getZones()
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {

            if (baseResponse.Success) {

                baseResponse.Zones.forEach(function (value) {
                    value.ZoneName = value.ZoneName.split("-")[1];
                })
                this.Zones = baseResponse.Zones;
                //this.zoneLovAll = baseResponse.Zones;
            } else
                this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

        });

    }

    GetBranches(ZoneId: string) {
        this.loading = true;
        this.dataSource.data = [];
        this.Branches = [];

        this.Zone.ZoneId = parseInt(ZoneId);
        this._circleService.getBranchesByZone(this.Zone)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {

            if (baseResponse.Success) {
                this.loading = false;
                this.Branches = baseResponse.Branches;
            } else
                this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

        });


    }

    GetLandHistoryData() {

        this.loading = true;
        this._landService.GetLandHistory(this.LandInfo)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(baseResponse => {

                if (baseResponse.Success) {


                    this.dataSource.data = baseResponse.searchLandData;
                    //if (this.landHistoryList != undefined) {
                    //  this.LandHistory = this.landHistoryList;
                    //}
                    //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                } else {
                    //this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

                }
            });

    }

    editland(Land: any) {

        this.loading = true;
        this.Branches = [];
        this.Zone.ZoneId = parseInt(Land.ZoneID);
        this._circleService.getBranchesByZone(this.Zone)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {

            if (baseResponse.Success) {
                this.loading = false;
                this.Branches = baseResponse.Branches;
                Land.Branch = this.Branches.filter(x => x.BranchId == Land.BranchId);
                Land.Zone = this.Zones.filter(x => x.ZoneId == Land.ZoneID);
                localStorage.setItem('SearchLandData', JSON.stringify(Land));
                localStorage.setItem('EditLandData', '1');
                localStorage.setItem('HistoryLandInfoId', Land.ID);
                this.router.navigate(['/land-creation/land-info-add', {upFlag: "1"}], {relativeTo: this.activatedRoute});
            } else
                this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

        });
    }

}


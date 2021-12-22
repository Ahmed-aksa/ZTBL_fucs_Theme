import {Component, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {SessionExpireService} from 'app/shared/services/session-expire.service';
import {Router} from '@angular/router';
import {ThrowStmt} from '@angular/compiler';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from "rxjs/operators";
import {DashboardService} from "../../shared/services/dashboard.service";
import {ClApplicationHeaderComponent} from "../loan/cl-application-header/cl-application-header.component";
import {ClCustomersComponent} from "../loan/cl-customers/cl-customers.component";
import {ClSecuritiesComponent} from "../loan/cl-securities/cl-securities.component";
import {ClLegalHeirsComponent} from "../loan/cl-legal-heirs/cl-legal-heirs.component";
import {ClPurposeComponent} from "../loan/cl-purpose/cl-purpose.component";
import {ClLoanWitnessComponent} from "../loan/cl-loan-witness/cl-loan-witness.component";
import {McoDashboradComponent} from "./mco-dashborad/mco-dashborad.component";
import {RecoveryOfficerDashboardComponent} from "./recovery-officer-dashboard/recovery-officer-dashboard.component";
import { BranchManagerDashboardComponent } from './branch-manager-dashboard/branch-manager-dashboard.component';
import { ZonalChiefDashboardComponent } from './zonal-chief-dashboard/zonal-chief-dashboard.component';
import { EvpCreditDashboardComponent } from './evp-credit-dashboard/evp-credit-dashboard.component';
import {EvpOdDashboardComponent} from "./evp-od-dashboard/evp-od-dashboard.component";
import { PresidentZtblComponent } from './president-ztbl/president-ztbl.component';
import { RegionalCheifComponent } from './regional-cheif/regional-cheif.component';
import { ProvincialChiefComponent } from './provincial-chief/provincial-chief.component';
import { RecoverySamDivisionComponent } from './recovery-sam-division/recovery-sam-division.component';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {

    @ViewChild(McoDashboradComponent, {static: false}) mcoDashboardComponent: McoDashboradComponent;
    @ViewChild(RecoveryOfficerDashboardComponent, {static: false}) recoveryOfficerDashboardComponent: RecoveryOfficerDashboardComponent;
    @ViewChild(BranchManagerDashboardComponent, {static: false}) branchManagerDashboardComponent: BranchManagerDashboardComponent;
    @ViewChild(ZonalChiefDashboardComponent, {static: false}) zonalChiefDashboardComponent: ZonalChiefDashboardComponent;
    @ViewChild(EvpCreditDashboardComponent, {static: false}) evpCreditDashboardComponent: EvpCreditDashboardComponent;
    @ViewChild(EvpOdDashboardComponent, {static: false}) evpOdDashboardComponent: EvpOdDashboardComponent;
    @ViewChild(PresidentZtblComponent, {static: false}) presidentZtblComponent: PresidentZtblComponent;
    @ViewChild(RegionalCheifComponent, {static: false}) regionalCheifComponent: RegionalCheifComponent;
    @ViewChild(ProvincialChiefComponent, {static: false}) provincialChiefComponent: ProvincialChiefComponent;
    @ViewChild(RecoverySamDivisionComponent, {static: false}) recoverySamDivisionComponent: RecoverySamDivisionComponent;
    popup: any = false;
    time: any
    sessionTime: any;
    userGroup: any = [];
    rolesData: any;

    constructor(private _sessionExpireService: SessionExpireService, private _router: Router, private spinner: NgxSpinnerService, private _dashboardService: DashboardService) {
        this.spinner.show();
    }

    dataSource = new MatTableDataSource();
    displayedColumns = ['EmployeeNo', 'EmployeeName', 'PhoneNumber', 'Email', 'ZoneName', 'BranchName', 'UserCircles', 'actions'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    ngOnInit(): void {
        this.setSessionTime();
        this.userGroup = JSON.parse(localStorage.getItem("ZTBLUser"))?.User?.userGroup
        this._sessionExpireService.count.subscribe(c => {
            if (c == 0) {
                this.Logout();
                return;3
            }
            if (c < 60) {
                this.popup = true;
                this.beep()
            }

            this.time = c.toString();
        });

        this.userGroup = JSON.parse(localStorage.getItem("ZTBLUser"))?.User?.userGroup
        this.userGroup.forEach((single_group)=>{
            this._dashboardService.getDashboardData(single_group.ProfileID).pipe(finalize(() => {
                this.spinner.hide()
            })).subscribe(result => {
                if(result.Code!="-1"){
                this.mcoDashboardComponent?.assignRoleData(result.DashboardReport);
                this.recoveryOfficerDashboardComponent?.assignRoleData(result.DashboardReport);
                this.branchManagerDashboardComponent?.assignRoleData(result.DashboardReport);
                this.zonalChiefDashboardComponent?.assignRoleData(result.DashboardReport);
                this.evpCreditDashboardComponent?.assignRoleData(result.DashboardReport);
                this.evpOdDashboardComponent?.assignRoleData(result.DashboardReport);
                this.presidentZtblComponent?.assignRoleData(result.DashboardReport);
                this.regionalCheifComponent?.assignRoleData(result.DashboardReport);
                this.provincialChiefComponent?.assignRoleData(result.DashboardReport);
                this.recoverySamDivisionComponent?.assignRoleData(result.DashboardReport);
                }
            });
        })


    }

    setSessionTime() {
        this.sessionTime = JSON.parse(localStorage.getItem("ZTBLUser"))?.SessionExpiryTime;
        this._sessionExpireService.timer(Number(this.sessionTime));
        //this._sessionExpireService.timer(1);
    }

    RefreshToken() {
        this.setSessionTime();
        this.popup = false;
        //this.hidePopup();
    }

    Logout() {
        this.hidePopup();
        this._router.navigate(['/sign-out']);
    }

    beep() {
        //var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");
        // snd.play();
    }

    hidePopup() {
        this._sessionExpireService.timerUnSubject();
        this.popup = false;
    }

    @HostListener('window:keydown')
    @HostListener('window:mousedown')
    // @HostListener('mousemove')
    checkUserActivity() {
        this.setSessionTime();
    }

}

import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {UserHistory} from '../models/user_history.model';
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CircleService} from "../../../shared/services/circle.service";
import {finalize} from "rxjs/operators";
import {User} from "../../../shared/models/user.model";
import {Circle} from "../../../shared/models/circle.model";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {UserService} from "../../../shared/services/user_extended.service";

@Component({
    selector: 'app-notification-detail',
    templateUrl: './notification-detail.component.html',
    styleUrls: ['./notification-detail.component.scss']
})
export class NotificationDetailsComponent implements OnInit {

    lat = 33.6844;
    lng = 73.0479;
    loadingAfterSubmit = false;
    viewLoading = false;
    submitted = false;
    _UserHistory: UserHistory = new UserHistory();
    notification: UserHistory = new UserHistory();
    request: BaseRequestModel = new BaseRequestModel();
    user: User = new User();
    loading: boolean;
    ///////////////////

    zoom: number;
    selectedArea = 0;
    fenceMarkers = [];
    userHistory: any;
    isLoadingFence: boolean;
    //fenceLoacations: any;
    googleMap: any;
    selectedMarker: any = null;
    Remarks: string = "";

    userFencesList = [];
    viewColor = "#ecbd00";

    ///////////////////


    constructor(public dialogRef: MatDialogRef<NotificationDetailsComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private _circleService: CircleService,
                private layoutUtilsService: LayoutUtilsService,
                private _userService: UserService,
                private _cdf: ChangeDetectorRef
    ) {
    }

    countryRestriction = {
        latLngBounds: {
            north: 37.0841069,
            east: 77.8231711,
            south: 23.6344999,
            west: 60.8729721
        },
        strictBounds: true
    };


    ngOnInit() {
        this.zoom = 0;
    }


    loadUserLocationHistory() {
        this.loading = true;
        this._UserHistory.Id = this.data.Notification.HistoryId;
        this.notification.Id = this.data.Notification.Id;
        this.request = new BaseRequestModel();
        this.request.Notification = this.notification;
        this.request.Notification = this.notification;
        this.request.UserHistory = this._UserHistory;
        this._circleService.GetUserHistory(this.request)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {

                this.userHistory = baseResponse.UserHistory;

            } else {
                this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
            }
        });

    }

    getFenceById() {
        this.loading = true;

        this.request = new BaseRequestModel();
        var circle = new Circle()
        circle.FenceIds = this.data.Notification.CircleFenceIds
        var userinfo = new User()
        userinfo.UserId = this.data.Notification.CreatedBy
        this.request.Circle = circle;
        this.request.UserInfo = userinfo;

        this._circleService.GetCricleFenceById(this.request)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {

                var circleFences = baseResponse.GeoFancPoints;
                var polygonCoordinate = []
                for (var i = 0; i < circleFences.length; i++) {

                    var fencePoints = circleFences[i].pointArray.split('|')
                    fencePoints.forEach((ob, i) => {
                        var lat: number = +ob.split(",")[0]
                        var lng: number = +ob.split(",")[1]
                        polygonCoordinate.push({lat: lat, lng: lng})
                    });
                    var color = this.viewColor
                    var index = this.userFencesList.indexOf(circleFences[i].id)
                    if (index == -1) {
                        color = this.viewColor
                    } else {
                        color = "#FF0000"
                    }
                    this.drawCircleFence(polygonCoordinate, color)
                }

                this.userHistory.Latitude = parseFloat(this.userHistory.Latitude);
                this.userHistory.Longitude = parseFloat(this.userHistory.Longitude);

                ///this.lat = polygonCoordinate[0].lat;
                //this.lng = polygonCoordinate[0].lng;
                //this.lat = this.userHistory.Latitude;
                //this.lng = this.userHistory.Longitude;

                this.zoom = 12;
            } else {
                this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
            }
        });
    }

    drawCircleFence(circleFence: any, color: any) {

        var selectedShape = new google.maps.Polygon({
            paths: circleFence,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35,
        });

        selectedShape.setMap(this.googleMap);
    }

    blockUser() {

        const _title = 'User block';
        const _description = 'Are you sure you want to block ?';
        const _waitDesciption = 'User is blocking...';
        const _UnblockMessage = `User has been blocked`;
        var bit = 0;
        const dialogRef = this.layoutUtilsService.AlertElementWarn(_title, _description, _waitDesciption, bit);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }

            this.user.Remarks = res.data;
            this.loading = true;

            this.user.UserName = this.userHistory.UserId;

            this.user.Remarks = this.Remarks;
            this.request.UserInfo = this.user;
            this.request.Notification = this.data.Notification;
            this._userService.blockUser(this.request)
                .pipe(
                    finalize(() => {
                        this.loading = false;
                    })
                ).subscribe(baseResponse => {

                if (baseResponse.Success === true) {
                    const message = `User has been blocked successfully.`;
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                    this.close(this.user);
                } else {
                    const message = `An error occure.`;
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }
            });
        });
    }


    getTitle(): string {
        return 'View Circle Fense';
    }

    ///////////////////Os Change Set Map
    onMapReady(map) {
        this.googleMap = map;
        if (this.data.Notification.CircleFenceIds != "null" && this.data.Notification.CircleFenceIds != null)
            this.userFencesList = this.data.Notification.CircleFenceIds.split(",");

        this.loadUserLocationHistory();
        this.getFenceById()
    }


    close(result: any): void {
        this.dialogRef.close(result);
    }

}


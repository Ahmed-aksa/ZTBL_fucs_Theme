// import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
// import {Branch} from 'app/shared/models/branch.model';
// import {Circle} from 'app/shared/models/circle.model';
// import {CircleService} from 'app/shared/services/circle.service';
// import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
// import {finalize} from 'rxjs/operators';

import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {Circle} from 'app/shared/models/circle.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {CircleService} from '../../../shared/services/circle.service';
import {LayoutUtilsService} from '../../../shared/services/layout_utils.service';
import {BaseResponseModel} from '../../../shared/models/base_response.model';
import {NgxSpinnerService} from 'ngx-spinner';
import {GeoFencingService} from '../service/geo-fencing-service.service';

// declare const google: any;

@Component({
    selector: 'kt-circle-view-map',
    templateUrl: './device-tracking.component.html',
})
export class DeviceTrackingComponent implements OnInit {
    viewForm: FormGroup;
    loadingAfterSubmit = false;
    viewLoading = false;
    submitted = false;
    loading: boolean;
    ///////////////////
    lat = 30.375321;
    lng = 69.345116;
    zoom: number;
    viewColor = '#ecbd00';
    selectedArea = 0;
    fenceMarkers: any = [];
    circlesSinglePoint: any;
    selectedShape: any;
    isLoadingFence: boolean;
    //fenceLoacations: any;
    googleMap: any;
    selectedMarker: any = null;
    previousInfoWindow: any;
    gridHeight: string;

    controlOptions = {
        mapTypeIds: ['satellite', 'roadmap', 'hybrid', 'terrain'],
    };
    zone;
    branch;
    circle;
    showViewAllBtn: boolean;

    device_locations: any;

    constructor(
        private _circleService: CircleService,
        private layoutUtilsService: LayoutUtilsService,
        private _cdf: ChangeDetectorRef,
        private fb: FormBuilder,
        private spinner: NgxSpinnerService,
        public _geoFencingService: GeoFencingService
    ) {
    }

    countryRestriction = {
        latLngBounds: {
            north: 37.084107,
            east: 77.823171,
            south: 23.6345,
            west: 60.872972,
        },
        strictBounds: true,
    };

    ngOnInit() {
        this.viewForm = this.fb.group({
            PPNo: [null],
        });
        this.zoom = 0;
    }

    ngAfterViewInit() {
        this.gridHeight = window.innerHeight - 250 + 'px';
    }

    loadCirclesSinglePoints() {
        this._circleService
            .getAllCirclesSinglePoints(this.branch)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.deleteSelectedShape();
                    this.circlesSinglePoint = baseResponse.circleSinglePoints;
                    this.fenceMarkers = [];
                    this.circlesSinglePoint.forEach((o, i) => {
                        if (o.Long != 0 && o.Lat != 0) {
                            // for view only
                            this.fenceMarkers.push({
                                lat: o.Lat,
                                lng: o.Long,
                                CircleId: o.CircleId,
                                BranchId: o.BranchId,
                            });
                        }
                    });
                    if (this.branch != null && this.fenceMarkers.length > 0) {
                        this.showViewAllBtn = true;
                        this.lat = this.fenceMarkers[0].lat;
                        this.lng = this.fenceMarkers[0].lng;
                    }
                    this._cdf.detectChanges();
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });
    }

    getTitle(): string {
        return 'View Circle Fence';
    }

    onMapReady(map) {
        this.googleMap = map;
        this.setCurrentLocation();
        if (this.zone && this.branch) {
            this.loadCirclesSinglePoints();
        }
    }

    clickedMarker(index: number, infowindow) {
        if (this.previousInfoWindow != null) {
            this.previousInfoWindow.close();
        }

        this.previousInfoWindow = infowindow;
    }

    removeClickedMarker(index: number) {
        if (this.selectedMarker == null) {
            this.selectedMarker = this.fenceMarkers[index];
            this.fenceMarkers.splice(index, 1);
        } else {
            var tempMarker = this.fenceMarkers[index];
            this.fenceMarkers.splice(index, 1);
            this.fenceMarkers.push({
                lat: this.selectedMarker.lat,
                lng: this.selectedMarker.lng,
                CircleId: this.selectedMarker.CircleId,
                BranchId: this.selectedMarker.BranchId,
            });
            this.selectedMarker = tempMarker;
        }
    }

    find() {
        // this.loadCirclesSinglePoints();

        this.SearchGeoFencePoint();
    }

    SearchGeoFencePoint() {
        var request = {
            LocationHistory: {
                PPNo: this.viewForm.controls.PPNo.value,
            },
            Circle: this.circle,
            Zone: this.zone,
            Branch: this.branch,
        };
        this.spinner.show();
        this._geoFencingService
            .GetDeviceTracking(request)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                this.spinner.hide();

                if (baseResponse.Success === true) {
                    this.device_locations =
                        baseResponse.LocationHistory.AgentLocations;
                } else {
                    this.device_locations = [];
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message
                    );
                }
            });
    }

    private setCurrentLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.lat = position.coords.latitude;
                this.lng = position.coords.longitude;
                this.zoom = 12;
                //this.getAddress(this.latitude, this.longitude);
            });
        }
    }

    deleteSelectedShape() {
        if (this.selectedShape) {
            this.selectedShape.setMap(null);
            this.selectedArea = 0;
        }
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;

        if (this.branch) {
            this.loadCirclesSinglePoints();
        }
    }
} //End of class

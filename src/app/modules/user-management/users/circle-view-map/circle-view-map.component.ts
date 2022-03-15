// import {Component, OnInit, ChangeDetectorRef} from '@angular/core';
// import {Branch} from 'app/shared/models/branch.model';
// import {Circle} from 'app/shared/models/circle.model';
// import {CircleService} from 'app/shared/services/circle.service';
// import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
// import {finalize} from 'rxjs/operators';

import {ChangeDetectorRef, Component, OnInit} from "@angular/core";
import {CircleService} from "../../../../shared/services/circle.service";
import {finalize} from "rxjs/operators";
import {Branch} from "app/shared/models/branch.model";
import {LayoutUtilsService} from "../../../../shared/services/layout_utils.service";
import {Circle} from "app/shared/models/circle.model";
import {FormBuilder, FormGroup} from "@angular/forms";

// declare const google: any;


@Component({
    selector: 'kt-circle-view-map',
    templateUrl: './circle-view-map.component.html'
})
export class CircleViewMapComponent implements OnInit {
    viewForm: FormGroup;
    loadingAfterSubmit = false;
    viewLoading = false;
    submitted = false;
    loading: boolean;
    ///////////////////
    lat = 30.375321;
    lng = 69.345116;
    zoom: number;
    viewColor = "#ecbd00";
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
        mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"]
    }
    zone;
    branch;
    circle;
    showViewAllBtn: boolean;

    constructor(
        private _circleService: CircleService,
        private layoutUtilsService: LayoutUtilsService,
        private _cdf: ChangeDetectorRef,
        private fb: FormBuilder
    ) {
    }


    countryRestriction = {
        latLngBounds: {
            north: 37.084107,
            east: 77.823171,
            south: 23.6345,
            west: 60.872972
        },
        strictBounds: true
    };


    ngOnInit() {
        this.viewForm = this.fb.group({});
        this.zoom = 0;
    }


    ngAfterViewInit() {
        this.gridHeight = window.innerHeight - 250 + 'px';
    }


    loadCirclesSinglePoints(br) {
        this._circleService.getAllCirclesSinglePoints(br)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {

            if (baseResponse.Success) {

                this.deleteSelectedShape()
                this.circlesSinglePoint = baseResponse.circleSinglePoints;
                this.fenceMarkers = []

                this.circlesSinglePoint.forEach((o, i) => {

                    if (o.Long != 0 && o.Lat != 0) {
                        // for view only
                        this.fenceMarkers.push({
                            lat: o.Lat,
                            lng: o.Long,
                            CircleId: o.CircleId,
                            BranchCode: o.BranchCode,
                            BranchId: o.BranchId,
                            CircleCode: o.CircleCode,
                        });
                    }
                });
                if (this.branch != null && this.fenceMarkers.length > 0) {
                    this.showViewAllBtn = true
                    this.lat = this.fenceMarkers[0].lat;
                    this.lng = this.fenceMarkers[0].lng;
                }
                this._cdf.detectChanges()

            } else {
                this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
            }
        });
    }


    getTitle(): string {
        return 'View Circle Fence';
    }


    ///////////////////Os Change Set Map
    onMapReady(map) {
        this.googleMap = map;
        this.setCurrentLocation()
        this.loadCirclesSinglePoints(null);
    }


    clickedMarker(index: number, infowindow) {
        this.viewCircleFence(index);
        return; // delete
        if (this.previousInfoWindow != null) {
            this.previousInfoWindow.close();
        }

        this.previousInfoWindow = infowindow;
    }

    removeClickedMarker(index: number) {

        if (this.selectedMarker == null) {
            this.selectedMarker = this.fenceMarkers[index]
            this.fenceMarkers.splice(index, 1)
        } else {
            var tempMarker = this.fenceMarkers[index];
            this.fenceMarkers.splice(index, 1)
            this.fenceMarkers.push({
                lat: this.selectedMarker.lat,
                lng: this.selectedMarker.lng,
                CircleId: this.selectedMarker.CircleId,
                BranchId: this.selectedMarker.BranchId,
            })
            this.selectedMarker = tempMarker
        }

    }

    viewCircleFence = (index: number) => {
        if (this.isLoadingFence) {
            return
        }
        this.isLoadingFence = true;
        var circle = new Circle();
        circle.Id = this.fenceMarkers[index].CircleId

        //this.removeClickedMarker(index)

        this._circleService.CirclePoligonGet(circle)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {

                    var OldFancPoints = baseResponse.GeoFancPoints;

                    const polygonCoordinate = [];
                    OldFancPoints.forEach((o, i) => {
                        if (o.Long != 0 && o.Lat != 0) {
                            // for view only
                            polygonCoordinate.push({
                                lat: o.Lat,
                                lng: o.Long,
                            });
                        }
                    });
                    if (polygonCoordinate.length > 0) {
                        this.deleteSelectedShape()

                        if (this.selectedShape) { // delete if condition
                            this.selectedShape.fillColor = "#FF0000"
                            this.selectedShape.setMap(this.googleMap);
                        }
                        this.selectedShape = new google.maps.Polygon({
                            paths: polygonCoordinate,
                            strokeColor: this.viewColor,
                            strokeOpacity: 0.8,
                            strokeWeight: 2,
                            fillColor: this.viewColor,
                            fillOpacity: 0.35,
                        });

                        this.selectedShape.setMap(this.googleMap);

                        if (this.zoom < 12) {
                            this.lat = polygonCoordinate[1].lat;
                            this.lng = polygonCoordinate[1].lng;
                            this.zoom = 12;
                        }

                    } else {
                        this.layoutUtilsService.alertElement("", "No fence created against this circle", baseResponse.Code);
                    }
                    this.isLoadingFence = false
                } else {
                    this.isLoadingFence = false
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
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

        this.circle = new Circle(); // delete
        this.circle.CircleId = 0; // delete
        this.loadAll(); // delete
        return; // delete
        if (this.branch) {
            this.loadCirclesSinglePoints(this.branch);
        }
    }

    loadAll() {
        this.zone = null;
        this.branch = null;
        //this.loadCirclesSinglePoints(null)

        // delete GetCirclesPolygon api call and uncomment the loadCirclesSinglePoints
        this._circleService.GetCirclesPolygon(this.circle)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(baseResponse => {

                if (baseResponse.Success) {

                    var circles = baseResponse.Circles;
                    // delete all polygon that are already drawn on google map.
                    this.deleteAllPolygons()
                    var polygonArray = []

                    circles.forEach((o, i) => {

                        var existingPolygonPoints = []
                        var fencePointString = o.GeoFancPoints;
                        var fencePoints = fencePointString.split('|')
                        if (fencePoints.length > 3) {
                            fencePoints.forEach((ob, i) => {
                                var lat: number = +ob.split(",")[0]
                                var lng: number = +ob.split(",")[1]

                                if (!isNaN(lat) && !isNaN(lng)) {
                                    polygonArray.push([lat, lng])
                                    existingPolygonPoints.push({lat: lat, lng: lng})
                                }
                            });

                            if ((polygonArray.length > 0) && (polygonArray[0][0] != polygonArray[polygonArray.length - 1][0] || polygonArray[0][1] != polygonArray[polygonArray.length - 1][1])) {
                                polygonArray.push([polygonArray[0][0], polygonArray[0][1]])
                            }

                            this.fenceMarkers.push({
                                lat: o.Lat,
                                lng: o.Long,
                                CircleId: o.CircleId,
                                BranchId: o.BranchId,
                                CircleCode: o.CircleCode,
                            });
                            this.drawPolygonOnMap(existingPolygonPoints, "#FF0000", o.Id)

                            this._cdf.detectChanges()
                        } else {
                            console.log(o.Id);
                        }
                    });

                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                }

            });
    }


    // delete Section start
    allPolygons = [];

    drawPolygonOnMap(polygon: any, color: any, circleId: any) {
        var existingPolygon = new google.maps.Polygon({
            paths: polygon,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: color,
            fillOpacity: 0.35,
            draggable: false,
            editable: false,
        });

        existingPolygon.setMap(this.googleMap);
        this.allPolygons.push(existingPolygon)

    }

    deleteAllPolygons() {
        for (var i = 0; i < this.allPolygons.length; i++) {
            this.allPolygons[i].setMap(null);
        }
        this.allPolygons = [];
    }

    // delete Section End    Delete all code within this section
    find() {

    }
}//End of class


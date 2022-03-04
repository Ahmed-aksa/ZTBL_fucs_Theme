import {ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, ViewChild,} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {BaseResponseModel} from '../../../shared/models/base_response.model';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {CircleService} from '../../../shared/services/circle.service';
import {MapsAPILoader} from '@agm/core';
import {UserUtilsService} from '../../../shared/services/users_utils.service';
import {finalize} from 'rxjs/operators';
import {GeoFencingService} from '../service/geo-fencing-service.service';
import {LayoutUtilsService} from '../../../shared/services/layout_utils.service';

@Component({
    selector: 'kt-view-get-fancing-modal',
    templateUrl: './view-get-fancing-modal.component.html',
    styleUrls: ['./view-get-fancing-modal.component.scss'],
})
export class ViewGetFancingModalComponent implements OnInit {
    lat: number;
    lng: number;
    loading: boolean;
    center: google.maps.LatLngLiteral;
    googleMap: any;
    vendorLocationMarker: any;
    zoom: number = 10;
    PreviousLocation: Loc[] = [];
    images = [];
    LoggedInUserInfo: BaseResponseModel;
    latlong;
    LocationHistories = new LocationHistories();
    geo_fence_points;

    start_end_mark = [];

    latlng = [
        [23.0285312, 72.5262336],
        [19.076, 72.8777],
        [25.2048, 55.2708],
    ];

    controlOptions = {
        mapTypeIds: ['satellite', 'roadmap', 'hybrid', 'terrain'],
    };

    @ViewChild('search')
    public searchElementRef: ElementRef;
    previousInfoWindow: any;
    isLoadingFence: boolean;

    // final(val){
    //   this.latlong[this.latlong.length][]
    // }
    fenceMarkers: any = [];
    selectedShape: any;
    viewColor = '#ecbd00';
    selectedArea = 0;
    ///////////////////Os Change Set Map
    countryRestriction = {
        latLngBounds: {
            north: 37.084107,
            east: 77.823171,
            south: 23.6345,
            west: 60.872972,
        },
        strictBounds: true,
    };

    constructor(
        public dialogRef: MatDialogRef<ViewGetFancingModalComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private mapsAPILoader: MapsAPILoader,
        private ngZone: NgZone,
        private userUtilsService: UserUtilsService,
        private _geoFencingService: GeoFencingService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private detector: ChangeDetectorRef,
        private _circleService: CircleService,
        private map_loader: MapsAPILoader
    ) {
    }

    ngOnInit() {
        this.map_loader.load();
        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

        navigator.geolocation.getCurrentPosition((position) => {
            this.center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
            };
        });

        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(
                this.searchElementRef.nativeElement
            );
            autocomplete.addListener('place_changed', () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult =
                        autocomplete.getPlace();
                    if (
                        place.geometry === undefined ||
                        place.geometry === null
                    ) {
                        return;
                    }

                    this.lat = place.geometry.location.lat();
                    this.lng = place.geometry.location.lng();
                    this.zoom = 15;
                });
            });
        });

        if (this.data.lat != undefined && this.data.lng != undefined) {
            this.PreviousLocation.push(this.data);
        }
    }

    // removeClickedMarker(index: number) {
    //
    //     if (this.selectedMarker == null) {
    //         this.selectedMarker = this.fenceMarkers[index]
    //         this.fenceMarkers.splice(index, 1)
    //     } else {
    //         var tempMarker = this.fenceMarkers[index];
    //         this.fenceMarkers.splice(index, 1)
    //         this.fenceMarkers.push({
    //             lat: this.selectedMarker.lat,
    //             lng: this.selectedMarker.lng,
    //             CircleId: this.selectedMarker.CircleId,
    //             BranchId: this.selectedMarker.BranchId,
    //         })
    //         this.selectedMarker = tempMarker
    //     }
    //
    // }

    clickedMarker(index: number, infowindow) {
        // this.viewCircleFence(index);
        // if (this.previousInfoWindow != null) {
        //     this.previousInfoWindow.close();
        // }
        // this.previousInfoWindow = infowindow;
    }

    viewCircleFence() {
        this.isLoadingFence = true;
        for (let i = 0; i < this.geo_fence_points.length; i++) {
            const polygonCoordinate = [];
            if (this.geo_fence_points[0]?.Long) {
                this.geo_fence_points[i].forEach((o, i) => {
                    if (o.Long != 0 && o.Lat != 0) {
                        // for view only
                        polygonCoordinate.push({
                            lat: o.Lat,
                            lng: o.Long,
                        });
                    }
                });
            } else if (this.geo_fence_points[0]?.Longitude) {
                this.geo_fence_points[i].forEach((o, i) => {
                    if (o.Long != 0 && o.Lat != 0) {
                        // for view only
                        polygonCoordinate.push({
                            lat: o.Latitude,
                            lng: o.Longitude,
                        });
                    }
                });
            }

            if (polygonCoordinate.length > 0) {
                this.addPolygon(polygonCoordinate);
            }
        }

        this.isLoadingFence = false;

        // this._circleService.CirclePoligonGet(circle)
        //     .pipe(
        //         finalize(() => {
        //             this.loading = false;
        //         })
        //     )
        //     .subscribe(baseResponse => {
        //
        //         if (baseResponse.Success) {
        //
        //             //code was here
        //
        //         }
        //         else {
        //             this.isLoadingFence = false
        //             this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
        //         }
        //
        //     });
    }

    addPolygon(polygonCoordinate) {
        if (polygonCoordinate.length > 0) {
            this.selectedShape = new google.maps.Polygon({
                paths: polygonCoordinate,
                strokeColor: this.viewColor,
                strokeOpacity: 0.8,
                strokeWeight: 2,
                fillColor: this.viewColor,
                fillOpacity: 0.35,
            });

            this.selectedShape.setMap(this.googleMap);
        }
    }

    isNumber(val) {
        return Number(val);
    }

    GetGeoFancPoint() {
        this.spinner.show();
        this._geoFencingService
            .GetGeoFancPoint(this.data)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.LocationHistories =
                        baseResponse.LocationHistory['LocationHistories'];
                    this.latlong = JSON.parse(
                        baseResponse.LocationHistory.LocationHistories[0][
                            'LocationData'
                            ]
                    );
                    this.start_end_mark.push(this.latlong[0]);
                    this.start_end_mark.push(
                        this.latlong[this.latlong?.length - 1]
                    );

                    console.log(
                        'start_end_mark' + JSON.stringify(this.start_end_mark)
                    );
                    this.detector.detectChanges();
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message
                    );
                }
            });
    }

    iconChange(i) {
        if (i == 0) {
            return '../../../assets/icons/start.png';
        } else {
            return '../../../assets/icons/stop.png';
        }
    }

    getPoligonGetByIds() {
        this.spinner.show();
        var request = {
            Circle: {
                CircleIds: this.data.CircleIDs,
            },
        };
        this._geoFencingService
            .CirclePoligonGetByIds(request)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.geo_fence_points =
                        baseResponse.GeoFancPoint.GeoFancPoints;

                    this.viewCircleFence();
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message
                    );
                }
            });
    }

    deleteSelectedShape() {
        if (this.selectedShape) {
            this.selectedShape.setMap(null);
            this.selectedArea = 0;
        }
    }

    Heading(i) {
        if (i == 0) {
            return 'Start';
        } else {
            return 'End';
        }
    }

    onMapReady(map) {
        this.googleMap = map;
        this.getPoligonGetByIds();
        this.GetGeoFancPoint();
        // this.viewCircleFence()
    }

    close(result: any): void {
        this.dialogRef.close(result);
    }
}

interface Loc {
    lat: number;
    lng: number;
}

// just an interface for type safety.
interface marker {
    lat: number;
    lng: number;
    label?: string;
    draggable: boolean;
}

export class LocationHistories {
    ID: string;
    ParentId: string;
    PPNo: string;
    CreatedDate: string;
    LocationData: string;
    ZoneID: string;
    BranchCode: string;
    CircleIDs: string;
}

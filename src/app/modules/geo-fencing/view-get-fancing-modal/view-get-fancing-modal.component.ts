import {ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, ViewChild} from "@angular/core";
import {NgxSpinnerService} from "ngx-spinner";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {CircleService} from "../../../shared/services/circle.service";
import {MapsAPILoader} from "@agm/core";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {finalize} from "rxjs/operators";
import {GeoFencingService} from "../service/geo-fencing-service.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";

@Component({
    selector: 'kt-view-get-fancing-modal',
    templateUrl: './view-get-fancing-modal.component.html',
    styleUrls: ['./view-get-fancing-modal.component.scss']
})
export class ViewGetFancingModalComponent implements OnInit {

    lat: number;
    lng: number;
    loading: boolean;
    center: google.maps.LatLngLiteral
    googleMap: any;
    vendorLocationMarker: any;
    zoom: number = 2;
    PreviousLocation: Loc[] = [];
    images = [];
    LoggedInUserInfo: BaseResponseModel;
    latlong;
    LocationHistories = new LocationHistories;
    geo_fence_points;

    // markers: marker[] = [
    //     {
    //         lat: 51.673858,
    //         lng: 7.815982,
    //         label: 'A',
    //         draggable: false
    //     },
    //     {
    //         lat: 51.373858,
    //         lng: 7.215982,
    //         label: 'B',
    //         draggable: false
    //     },
    //     {
    //         lat: 51.723858,
    //         lng: 7.895982,
    //         label: 'C',
    //         draggable: false
    //     }
    // ]
    response = [
        {
            "Success": true,
            "GeoFancPoint": {
                "GeoFancPoints": [
                    [
                        {
                            "Lat": 33.677756428136064,
                            "Long": 33.677756428136064
                        },
                        {
                            "Lat": 33.66889918794184,
                            "Long": 33.66889918794184
                        },
                        {
                            "Lat": 33.655325840605364,
                            "Long": 33.655325840605364
                        },
                        {
                            "Lat": 33.66404160442622,
                            "Long": 33.66404160442622
                        },
                        {
                            "Lat": 33.677756428136064,
                            "Long": 33.677756428136064
                        }
                    ],
                    [
                        {
                            "Lat": 33.69296599138837,
                            "Long": 33.69296599138837
                        },
                        {
                            "Lat": 33.68453883940059,
                            "Long": 33.68453883940059
                        },
                        {
                            "Lat": 33.669539321976124,
                            "Long": 33.669539321976124
                        },
                        {
                            "Lat": 33.6779679442981,
                            "Long": 33.6779679442981
                        },
                        {
                            "Lat": 33.69296599138837,
                            "Long": 33.69296599138837
                        }
                    ],
                    [
                        {
                            "Lat": 33.65902157312111,
                            "Long": 33.65902157312111
                        },
                        {
                            "Lat": 33.65073399056965,
                            "Long": 33.65073399056965
                        },
                        {
                            "Lat": 33.636586100859596,
                            "Long": 33.636586100859596
                        },
                        {
                            "Lat": 33.6445892331688,
                            "Long": 33.6445892331688
                        },
                        {
                            "Lat": 33.65294885370565,
                            "Long": 33.65294885370565
                        },
                        {
                            "Lat": 33.65902157312111,
                            "Long": 33.65902157312111
                        }
                    ],
                    [
                        {
                            "Lat": 33.684855689694125,
                            "Long": 33.684855689694125
                        },
                        {
                            "Lat": 33.570508130262056,
                            "Long": 33.570508130262056
                        },
                        {
                            "Lat": 33.62998780354645,
                            "Long": 33.62998780354645
                        },
                        {
                            "Lat": 33.684855689694125,
                            "Long": 33.684855689694125
                        }
                    ],
                    [
                        {
                            "Lat": 33.700789681408246,
                            "Long": 33.700789681408246
                        },
                        {
                            "Lat": 33.655077343956115,
                            "Long": 33.655077343956115
                        },
                        {
                            "Lat": 33.623064251515565,
                            "Long": 33.623064251515565
                        },
                        {
                            "Lat": 33.700789681408246,
                            "Long": 33.700789681408246
                        }
                    ]
                ]
            },
            "TranId": "0",
            "isWebOTPEnabled": false,
            "CanCollectRecoveryForAllMCO": false
        }]
    // geo_fence_points: any = [
    //     [
    //         {
    //             "Lat": 33.684855689694125,
    //             "Long": 72.4563497109375
    //         },
    //         {
    //             "Lat": 33.570508130262056,
    //             "Long": 72.297047953125
    //         },
    //         {
    //             "Lat": 33.62998780354645,
    //             "Long": 72.6541036171875
    //         },
    //         {
    //             "Lat": 33.684855689694125,
    //             "Long": 72.4563497109375
    //         }
    //     ],
    //     [
    //         {
    //             "Lat": 33.700789681408246,
    //             "Long": 72.82877018046129
    //         },
    //         {
    //             "Lat": 33.655077343956115,
    //             "Long": 72.73538639139879
    //         },
    //         {
    //             "Lat": 33.623064251515565,
    //             "Long": 72.81778385233629
    //         },
    //         {
    //             "Lat": 33.700789681408246,
    //             "Long": 72.82877018046129
    //         }
    //     ],
    //     [
    //         {
    //             "Lat": 33.65902157312111,
    //             "Long": 73.04015933604664
    //         },
    //         {
    //             "Lat": 33.65073399056965,
    //             "Long": 73.02505313487477
    //         },
    //         {
    //             "Lat": 33.636586100859596,
    //             "Long": 73.03535281749195
    //         },
    //         {
    //             "Lat": 33.6445892331688,
    //             "Long": 73.0513173255486
    //         },
    //         {
    //             "Lat": 33.65294885370565,
    //             "Long": 73.04573833079762
    //         },
    //         {
    //             "Lat": 33.65902157312111,
    //             "Long": 73.04015933604664
    //         }
    //     ],
    // ]

    start_end_mark = [];

    // latlng = [
    //     [
    //         '23.0285312',
    //         '72.5262336'
    //     ],
    //     [
    //         '19.0760',
    //         '72.8777'
    //     ],
    //     [
    //         '25.2048',
    //         '55.2708'
    //     ]
    // ];

    latlng = [
        [
            23.0285312,
            72.5262336
        ],
        [
            19.0760,
            72.8777
        ],
        [
            25.2048,
            55.2708
        ]
    ];


    controlOptions = {
        mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"]
    }


    @ViewChild('search')
    public searchElementRef: ElementRef;

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


    fixing() {
        // this.latlng[0][1]='23.0285312'
        //
        //
        // for(let i =0;this.latlng.length;i++){
        //     this.latlng[i][0] = Number(this.latlng[i][0])
        //     Number(this.latlng[i][1])
        // }
    }

    ngOnInit() {
        this.map_loader.load();
        this.LoggedInUserInfo = this.userUtilsService.getUserDetails();


        navigator.geolocation.getCurrentPosition((position) => {
            this.center = {
                lat: position.coords.latitude,
                lng: position.coords.longitude
            }
        })

        this.mapsAPILoader.load().then(() => {
            let autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement);
            autocomplete.addListener("place_changed", () => {
                this.ngZone.run(() => {
                    let place: google.maps.places.PlaceResult = autocomplete.getPlace();
                    if (place.geometry === undefined || place.geometry === null) {
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

    // final(val){
    //   this.latlong[this.latlong.length][]
    // }


    previousInfoWindow: any;
    isLoadingFence: boolean;
    fenceMarkers: any = [];
    selectedShape: any;
    viewColor = "#ecbd00";
    selectedArea = 0;

    clickedMarker(index: number, infowindow) {


        // this.viewCircleFense(index);
        // if (this.previousInfoWindow != null) {
        //     this.previousInfoWindow.close();
        // }

        // this.previousInfoWindow = infowindow;
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

    viewCircleFense() {
        if (this.isLoadingFence) {
            return
        }
        this.isLoadingFence = true;

        for (let i = 0; i < this.geo_fence_points.length; i++) {

            const polygonCoordinate = [];
            this.geo_fence_points[i].forEach((o, i) => {
                if (o.Long != 0 && o.Lat != 0) {
                    // for view only
                    polygonCoordinate.push({
                        lat: o.Lat,
                        lng: o.Long,
                    });
                }
            });
            if (polygonCoordinate.length > 0) {
                this.addPolygon(polygonCoordinate)
            }
        }

        this.isLoadingFence = false


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

        console.log("polygon" + polygonCoordinate)
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
        this.spinner.show()
        this._geoFencingService.GetGeoFancPoint(this.data)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })).subscribe((baseResponse: BaseResponseModel) => {
            if (baseResponse.Success === true) {
                this.LocationHistories = baseResponse.LocationHistory["LocationHistories"]
                this.latlong = JSON.parse(baseResponse.LocationHistory.LocationHistories[0]["LocationData"]);
                this.start_end_mark.push(this.latlong[0]);
                this.start_end_mark.push(this.latlong[this.latlng.length - 1]);

                this.detector.detectChanges();
            } else {
                this.layoutUtilsService.alertElement("", baseResponse.Message);
            }
        });
    }

    getPoligonGetByIds() {
        this.spinner.show()
        var request = {
            Circle: {
                CircleIds: this.data.CircleIDs,
            }
        }
        this._geoFencingService.CirclePoligonGetByIds(request)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })).subscribe((baseResponse: BaseResponseModel) => {
            if (baseResponse.Success === true) {
                baseResponse
                this.geo_fence_points =baseResponse.GeoFancPoint.GeoFancPoints;
                console.log("geo fence points"+JSON.stringify(this.geo_fence_points))

                this.viewCircleFense();
            } else {
                this.layoutUtilsService.alertElement("", baseResponse.Message);
            }
        });
    }

    deleteSelectedShape() {

        if (this.selectedShape) {
            this.selectedShape.setMap(null);
            this.selectedArea = 0;
        }
    }


    ///////////////////Os Change Set Map
    onMapReady(map) {
        this.googleMap = map;
        this.getPoligonGetByIds();
        this.GetGeoFancPoint();
        // this.viewCircleFense()
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

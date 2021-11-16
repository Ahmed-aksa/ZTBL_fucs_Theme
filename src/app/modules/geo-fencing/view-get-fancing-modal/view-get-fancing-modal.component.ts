import {MapsAPILoader} from '@agm/core';
import {ChangeDetectorRef, Component, ElementRef, Inject, NgZone, OnInit, ViewChild} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {NgxSpinnerService} from 'ngx-spinner';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {GeoFencingService} from "../service/geo-fencing-service.service";

@Component({
    selector: 'kt-view-get-fancing-modal',
    templateUrl: './view-get-fancing-modal.component.html',
    styleUrls: ['./view-get-fancing-modal.component.scss']
})
export class ViewGetFancingModalComponent implements OnInit {

    lat: number;
    lng: number;
    center: google.maps.LatLngLiteral
    googleMap: any;
    vendorLocationMarker: any;
    zoom: number = 2;
    PreviousLocation: Loc[] = [];
    images = [];
    LoggedInUserInfo: BaseResponseModel;
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
        private detector: ChangeDetectorRef
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
        this.getPoligonGetByIds();
        this.GetGeoFancPoint()

    }

    // final(val){
    //   this.latlong[this.latlong.length][]
    // }

    isNumber(val) {
        return Number(val);
    }

    latlonggg = [];
    latlong;
    LocationHistories = new LocationHistories;

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
                debugger;
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
            } else {
                this.layoutUtilsService.alertElement("", baseResponse.Message);
            }
        });
    }


    ///////////////////Os Change Set Map
    onMapReady(map) {
        this.googleMap = map;
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

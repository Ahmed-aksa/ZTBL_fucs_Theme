/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable @typescript-eslint/member-ordering */
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
import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {Branch} from 'app/shared/models/branch.model';
import {Zone} from 'app/shared/models/zone.model';
import {GoogleMapsAPIWrapper, MapsAPILoader} from '@agm/core';
import {CircleService} from 'app/shared/services/circle.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';

@Component({
    selector: 'app-vendor-radius',
    templateUrl: './view-map.component.html',
    styleUrls: ['./view-map.component.scss']
})

export class ViewMapsComponent implements OnInit {

    loading: boolean;
    getRadius: any;
    radiusInfo: any;
    ///////////////////
    lat = null;
    lng = null;
    zoom: number = 2;
    //fenceLoacations: any;
    googleMap: any;
    selectedMarker: any = null;
    previousInfoWindow: any;
    vendorLov: any;


    controlOptions = {
        mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"]
    }
    ///////////////////

    radiusForm: FormGroup;

    selected_b;
    selected_z;
    selected_c;
    loaded = false;
    disable_circle = true;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    single_zone = true;

    Zones: any = [];
    SelectedZones: any = [];
    public Zone = new Zone();

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];
    public Branch = new Branch();

    user: any = {}
    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];
    LoggedInUserInfo: BaseResponseModel;

    constructor(
        @Inject(MAT_DIALOG_DATA) public data: any,
        public dialogRef: MatDialogRef<ViewMapsComponent>,
        private _circleService: CircleService,
        private layoutUtilsService: LayoutUtilsService,
        private _cdf: ChangeDetectorRef,
        private dialog: MatDialog,
        private fb: FormBuilder,
        private mapsAPILoader: MapsAPILoader,
        private userUtilsService: UserUtilsService,
        private cdRef: ChangeDetectorRef,
        private spinner: NgxSpinnerService,
        private _lovService: LovService
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

    close(result: any): void {
        this.dialogRef.close(result);
    }


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


    isNumber(val) {
        return Number(val);
    }

    loc_arr = [];

    ngOnInit() {

    }


    getTitle(): string {
        return 'View Circle Fense';
    }


    ///////////////////Os Change Set Map
    onMapReady(map) {
        this.loc_arr.push(this.data);
        this.googleMap = map;
        //this.setCurrentLocation()
    }


}

import { Component, OnInit, Inject, NgZone, ViewChild, ElementRef } from '@angular/core';

import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { getGeom } from "@turf/invariant";

import { delay, finalize } from 'rxjs/operators';
import {polygon} from "@turf/helpers";
import { Observable, of, Subscription, from } from 'rxjs';
import polygonClipping from "polygon-clipping";
import { Zone } from '../../users/utils/zone.model';
import { User } from 'app/shared/models/user.model';
import { Circle } from 'app/shared/models/circle.model';
import { Branch } from 'app/shared/models/branch.model';
import { Activity } from 'app/shared/models/activity.model';
import { BaseRequestModel } from 'app/shared/models/base_request.model';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MapsAPILoader } from '@agm/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { CircleService } from 'app/shared/services/circle.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { BaseResponseModel } from 'app/shared/models/base_response.model';

declare const google: any;



@Component({
  selector: 'kt-geofencing-edit',
  templateUrl: './geofencing-edit.component.html'
})
export class GeofencingEditComponent implements OnInit {

  saving = false;
  submitted = false;
  //markers: marker[] = [];
  polygonPoints: any = [];
  loadingAfterSubmit = false;
  viewLoading = false;
  activityForm: FormGroup;
  private componentSubscriptions: Subscription;
  user: User = new User();
  circle: Circle = new Circle();
  public Zone = new Zone();
  public Branch = new Branch();
  _currentActivity: Activity = new Activity();
  OldFancPoints: any;
  NewFancPoints: string;
  loading: boolean;
  public request = new BaseRequestModel();

  title: string = 'AGM project';
  zoom: number = 2;
  address: string;
  gridHeight: string;
  //implements OnInit



  ///////////////////
  lat = 30.375321;
  lng = 69.345116;
  pointList: { lat: number; lng: number }[] = [];
  fenceCenter: any;
  drawingManager: any;
  selectedShape: any;
  selectedArea = 0;
  fenceMarkers = [];
  multiPolygonArray = [];
  allPolygons = [];
  googleMap: any;
  createColor = "#0f298f";
  editColor = "#00661a";
  viewColor = "#ecbd00";
  isClearBtnShown: boolean = false;
  isSaveBtnShown: boolean = false;
  isEditBtnShown: boolean = false;
  isDeleteBtnShown: boolean = false;

  controlOptions = {
    mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"]
  }

  @ViewChild('search')
  public searchElementRef: ElementRef;

  ///////////////////

  constructor(public dialogRef: MatDialogRef<GeofencingEditComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private _snackBar: MatSnackBar,
    private layoutUtilsService: LayoutUtilsService,
    private _circleService: CircleService,
  ) { }


  /*onChoseLocation(event: any) {
    console.log(event);
    this.markers.push({
      lat: event.coords.lat,
      lng: event.coords.lng,
    });
    console.log(this.markers);
    debugger
  }*/

  Clear() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.selectedArea = 0;
      this.pointList = [];
      // To show:
      if (this.drawingManager) {
        this.drawingManager.setOptions({
          drawingControl: true,
          drawingMode: google.maps.drawing.OverlayType.POLYGON,
          drawingControlOptions: {
            drawingModes: ['polygon'],
          }
        });
      } else {
        this.createCircleFense()
      }
    }
      this.isClearBtnShown = false;
      this.isSaveBtnShown = false;
      this.isEditBtnShown = false;
      this.isDeleteBtnShown = false;
    
  }


  //[center] = "30.3753,69.3451"
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



  ngOnDestroy() {
    if (this.componentSubscriptions) {
      this.componentSubscriptions.unsubscribe();
    }
  }


  ngOnInit() {
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

    var u = new UserUtilsService();
    this._currentActivity = u.getActivity('Create Fense');

  }


  ngAfterViewInit() {
    //this.gridHeight = window.innerHeight - 390 + 'px';
  }


  private setCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
        this.zoom = 12;
        console.log('Current Location => ' + this.lat + ',' + this.lng)
        //this.getAddress(this.latitude, this.longitude);
      });
    } else {

      console.log('Current Location not found ')
    }
  }




  GetCirclePoligons() {

    this.circle = new Circle()
    if (this.data.circle && this.data.circle.Id) {
      this.circle = this.data.circle;
    }

    this._circleService.CirclePoligonGet(this.circle)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        if (baseResponse.Success) {

          this.OldFancPoints = baseResponse.GeoFancPoints;

          this.OldFancPoints.forEach((o, i) => {
            if (o.Long != 0 && o.Lat != 0) {
              // for view only
              this.polygonPoints.push({
                lat: o.Lat,
                lng: o.Long,
              });
            }
          });

          console.log('zoom level ==> ' + this.googleMap.getZoom())
          if (this.OldFancPoints.length > 0) {
            this.viewCircleFense()
            this.lat = this.polygonPoints[2].lat;
            this.lng = this.polygonPoints[2].lng;
            this.zoom = 12;

            this.isClearBtnShown = false;
            this.isSaveBtnShown = false;
            this.isEditBtnShown = true;
            this.isDeleteBtnShown = true;
          }
          else {
            this.setCurrentLocation();
            this.createCircleFense()
            this.isClearBtnShown = false;
            this.isSaveBtnShown = false;
            this.isDeleteBtnShown = false;
            this.isEditBtnShown = false;
          }

        }
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });
  }
  

  DeeteCircleFence() {

    this.circle = new Circle()
    if (this.data.circle && this.data.circle.Id) {
      this.circle = this.data.circle;
    }

    this._circleService.DeleteCircleFence(this.circle)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe(baseResponse => {
        if (baseResponse.Success) {
          this.Clear()
        }
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });
  }

  GetAllCircleWithPolygonPoints(lat: any, lng: any) {

    if (this.data.circle && this.data.circle.Id) {
      this.circle = this.data.circle;
      this.circle.CenterLongitude = ""
      this.circle.CenterLatitude = ""
    }
    if (lat != -1) {
      this.circle.CenterLatitude = lat
      this.circle.CenterLongitude = lng
    }

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

          circles.forEach((o, i) => {

            var polygonArray = []
            var existingPolygonPoints = []
            var circleInfo
            var fencePointString = o.GeoFancPoints;
            var fencePoints = fencePointString.split('|')
            if (fencePoints.length > 3) {
              fencePoints.forEach((ob, i) => {
                var lat: number = +ob.split(",")[0]
                var lng: number = +ob.split(",")[1]
                polygonArray.push([lat, lng])
                existingPolygonPoints.push({ lat: lat, lng: lng })
              });
              circleInfo = {
                circleID: o.Id,
                circleCode: o.CircleCode,
                circleFense: polygonArray
              }

              this.drawPolygonOnMap(existingPolygonPoints, "#FF0000")

              /*
                *
               * creating multipolygon at the time of loading data from server.
               * this will help us to speed up the process of checking the overlapping.
               * because most of the work will be done as soon as the data is loaded.
               *
               */
              this.multiPolygonArray.push(circleInfo)
            }
          });

        }
        else
          this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

      });
  }

  splitArryIntoChuks(array, size) {
    const chunked_arr = [];
    let index = 0;
    while (index < array.length) {
      chunked_arr.push(array.slice(index, size + index));
      index += size;
    }
    return chunked_arr;
  }

  checkForOverlapping(createdPolygon): Boolean {

    var newPolygon = polygon([
      createdPolygon
    ])

    var index = -1
    var intersection: any;

    for (var i = 0; i < this.multiPolygonArray.length; i++) {
      var poly2 = polygon([
        this.multiPolygonArray[i].circleFense
      ])
      const geom1 = getGeom(newPolygon);
      const geom2 = getGeom(poly2);

      // var intersec = turf.intersect(geom1, geom2)
      intersection = polygonClipping.intersection(
        geom1.coordinates as any,
        geom2.coordinates as any
      );
      index = i
      if (intersection.length > 0) {
        break
      }
    }

    if (intersection) {
      if (intersection.length > 0) {
        var polygon2 = []
        this.multiPolygonArray[index].circleFense.forEach((o, i) => {
          debugger;
          polygon2.push({ lat: o[0], lng: o[1] })
        });
        this.drawPolygonOnMap(polygon2, "#FF0000")
      }

      return intersection.length > 0
    } else {
      return false;
    }
  }


  deleteAllPolygons() {
    for (var i = 0; i < this.allPolygons.length; i++) {
      this.allPolygons[i].setMap(null);
    }
    this.allPolygons = [];
  }

  drawPolygonOnMap(polygon: any, color: any) {
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

  onSubmit() {

    if (this.OldFancPoints.length > 0 && this.pointList.length < 3) {

      this.layoutUtilsService.alertElement("", "It looks like you have not made any changes in Fence. Please make desired changes and then try again", "No Changes Detected")
      return
    } else {
      if (this.pointList.length < 3) {
        this.layoutUtilsService.alertElement("", "Please create a Fence before saving", "Fence not Created")
        return
      }
    }
    this.NewFancPoints = '';

    var polygonArrayForOverlapingCheck = []
    this.pointList.forEach((o, i) => {

      if (o.lat != 0 && o.lng != 0) {
        this.NewFancPoints = this.NewFancPoints + '' + (o.lat.toString() + ',' + o.lng + '|');
        var lat: number = +o.lat
        var lng: number = +o.lng
        polygonArrayForOverlapingCheck.push([lat, lng])
      }
    });

    /*--------------- Start ---------------------
    *
    * It is mandatory to keep the first and last index of polygon same.
    * data will also be saved on server in same fashion.
    * 
    */

    this.NewFancPoints = this.NewFancPoints + '' + (this.pointList[0].lat.toString() + ',' + this.pointList[0].lng);
    var lat: number = +this.pointList[0].lat
    var lng: number = +this.pointList[0].lng
    polygonArrayForOverlapingCheck.push([lat, lng])

    /* --------------- End ---------------------*/




    if (!this.checkForOverlapping(polygonArrayForOverlapingCheck)) {


      this.request = new BaseRequestModel();


      this.circle.GeoFancPoints = this.NewFancPoints;
      this.circle.Id = this.circle.Id;
      this.circle.CenterLatitude = this.fenceCenter.lat().toString();
      this.circle.CenterLongitude = this.fenceCenter.lng().toString();

      this.request.Circle = this.circle;
      this.request.Zone = this.data.zone;
      this.request.Branch = this.data.branch;
      
      this.submitted = true;
      // this.ktDialogService.show();

      if (this.OldFancPoints.length > 0) {
        this._circleService.CirclePoligonUpdate(this.request)
          .pipe(
            finalize(() => {
              this.submitted = false;
              // this.ktDialogService.hide();
            })
          )
          .subscribe((baseResponse: BaseResponseModel) => {
            console.log(baseResponse);
            if (baseResponse.Success === true) {
              const message = `Polygon has been updated successfully`;
              this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
              this.close(this.circle);
            }
            else {
              const message = `An error occure.`;
              this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
            }
          });
      }

      



      else {
        this._circleService
          .CirclePoligonAdd(this.request)
          .pipe(
            finalize(() => {
              this.submitted = false;
              // this.ktDialogService.hide();
            })
          )
          .subscribe((baseResponse: BaseResponseModel) => {

            console.log('base response');
            console.log(baseResponse);
            if (baseResponse.Success === true) {
              const message = `Polygon has been updated successfully`;
              this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
              this.close(this.circle);
            }
            else {
              const message = `An error occure.`;
              this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
            }

          });
      }
    } else {
      this.layoutUtilsService.alertElement("", "Fence of this Circle can not be created because it is overlaping with the fense of another Circle", "Fence Ovelapped");
    }

  }



  getTitle(): string {
    return 'Add Geofencing';
  }



  ///////////////////Os Change Set Map
  onMapReady(map) {
    this.googleMap = map;
    this.GetCirclePoligons();
    this.GetAllCircleWithPolygonPoints(-1, -1)
    //this.geocodeLatLng(new google.maps.Geocoder(), "30.375321,69.345116")
  }


  viewCircleFense = () => {

    this.selectedShape = new google.maps.Polygon({
      paths: this.polygonPoints,
      strokeColor: this.viewColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: this.viewColor,
      fillOpacity: 0.35,
    });
    this.selectedShape.setMap(this.googleMap);
  }

  editCircleFense = () => {

    this.isClearBtnShown = false;
    this.isSaveBtnShown = true;
    this.isEditBtnShown = false;

    this.deleteSelectedShape();
    this.selectedShape = new google.maps.Polygon({
      paths: this.polygonPoints,
      strokeColor: this.editColor,
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: this.editColor,
      fillOpacity: 0.35,
      draggable: false,
      editable: true,
    });

    this.selectedShape.setMap(this.googleMap);
    //console.log(this.selectedShape.getPath())

    google.maps.event.addListener(
      this.selectedShape.getPath(),
      'set_at',
      (event) => {
        this.updatePointList(this.selectedShape.getPath())
      }
    );
    google.maps.event.addListener(
      this.selectedShape.getPath(),
      'remove_at',
      (event) => {
        this.updatePointList(this.selectedShape.getPath())
      }
    );
    google.maps.event.addListener(
      this.selectedShape.getPath(),
      'insert_at',
      (event) => {
        this.updatePointList(this.selectedShape.getPath())
      }
    );
    google.maps.event.addListener(this.selectedShape,
      'click', (event) => {
        this.updatePointList(this.selectedShape.getPath())
      }
    );
  }

  createCircleFense = () => {
    const self = this;
    const options = {
      drawingControl: false,
      drawingControlOptions: {
        drawingModes: ['polygon'],
      },
      polygonOptions: {
        strokeColor: this.createColor,
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: this.createColor,
        fillOpacity: 0.35,
        draggable: false,
        editable: true,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(this.googleMap);
    google.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      (event) => {

        this.isClearBtnShown = true;
        this.isSaveBtnShown = true;
        this.isEditBtnShown = false;
        this.isDeleteBtnShown = false;
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(
              paths.getAt(p),
              'set_at',
              () => {
                if (!event.overlay.drag) {
                  self.updatePointList(event.overlay.getPath());
                }
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'insert_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'remove_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
          }
          self.updatePointList(event.overlay.getPath());
          this.selectedShape = event.overlay;
          this.selectedShape.type = event.type;
        }
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          // Switch back to non-drawing mode after drawing a shape.
          self.drawingManager.setDrawingMode(null);
          // To hide:
          self.drawingManager.setOptions({
            drawingControl: false,
          });
        }
      }
    );
  }

  deleteSelectedShape() {

    if (this.selectedShape) {
      this.selectedShape.setMap(null);
    }
  }

  updatePointList(path) {

    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(
        path.getAt(i).toJSON()
      );
      console.log(path.getAt(i).toJSON())
    }
    var bounds = new google.maps.LatLngBounds();
    this.pointList.forEach((o, i) => {
      bounds.extend(new google.maps.LatLng(o.lat, o.lng));
    });

    this.fenceCenter = bounds.getCenter()

    // Need to get all the surrounding cricles of created/edit fence.
    this.GetAllCircleWithPolygonPoints(this.fenceCenter.lat().toString(), this.fenceCenter.lng().toString())

    this.selectedArea = google.maps.geometry.spherical.computeArea(
      path
    );
  }


  /////////////////////End of OS Change Set Map

  geocodeLatLng(geocoder: any, input: any) {

  const latlngStr = input.split(",", 2);
  const latlng = {
    lat: parseFloat(latlngStr[0]),
    lng: parseFloat(latlngStr[1]),
  };
  geocoder.geocode(
    { location: latlng },
    (
      results: google.maps.GeocoderResult[],
      status: google.maps.GeocoderStatus
    ) => {
      if (status === "OK") {
        debugger
      } else {
        window.alert("Geocoder failed due to: " + status);
      }
    }
  );
}


}//End of class

interface marker {
  lat: number;
  lng: number;
}

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
import { MapsAPILoader } from '@agm/core';
import { Component, ElementRef, Inject, NgZone, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';

@Component({
  selector: 'app-address-location',
  templateUrl: './address-location.component.html',
  styleUrls: ['./address-location.component.scss']
})
export class AddressLocationComponent implements OnInit, OnDestroy {

  // @ViewChild(MapInfoWindow, { static: false }) info: MapInfoWindow

  lat : number;
  lng: number;
  viewLoading = false;
  loadingAfterSubmit = false;
  center : google.maps.LatLngLiteral
  googleMap: any;
  vendorLocationMarker: any;
  zoom: number = 2;
  PreviousLocation: Loc[] = [];
  images = [];
  iconUrl: string;

  mapClickListener;

  markers = []


  controlOptions = {
    mapTypeIds: ["satellite", "roadmap", "hybrid", "terrain"]
  }


  @ViewChild('search')
  public searchElementRef: ElementRef;

  constructor(
    public dialogRef: MatDialogRef<AddressLocationComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private layoutUtilsService: LayoutUtilsService,
  ) { }

  ngOnInit() {
    navigator.geolocation.getCurrentPosition((position)=>{
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
          this.addmarker(this.lat, this.lng)

        });
      });
    });

    if(this.data.lat != undefined && this.data.lng != undefined && this.data.iconUrl != undefined){

      this.PreviousLocation.push(this.data);
    }

    if(this.data.type == "1"){
      this.iconUrl = '../../../../assets/icons/seed.png';
    }else if(this.data.type == "2"){
      this.iconUrl = '../../../../assets/icons/fertilizer_icon.png';
    }else if(this.data.type == "3"){
      this.iconUrl = '../../../../assets/icons/seed and fertilizer_icon.png';
    }
  }



  ///////////////////Os Change Set Map
  onMapReady(map: google.maps.Map) {
    this.googleMap = map;
    this.mapClickListener = this.googleMap.addListener('click', (e: google.maps.MouseEvent) => {
      this.ngZone.run(() => {
        // Here we can get correct event
        this.PreviousLocation = []
        if(this.data.type != undefined && this.data.type != null){
          this.addmarker(e.latLng.lat(), e.latLng.lng())
        }else{
          this.layoutUtilsService.alertElement('','Could not add location without type of vendor.')
        }
      });
    });
  }

  // click($event: google.maps.IconMouseEvent){
  //
  //
  //   //this.googleMap.setMap(null)
  //   this.PreviousLocation = []
  //   //this.addmarker(event.coords.lat, event.coords.lng)

  // }

  //Pakistan Geolocation
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

  addmarker(lat: any, lng: any): void {

    if (this.vendorLocationMarker != null) {
      this.vendorLocationMarker.setMap(null)
    }
    var myLatLng = { lat: lat, lng: lng };
    this.vendorLocationMarker = new google.maps.Marker({
      position: myLatLng,
      title: "",
      icon: this.iconUrl
    });
    this.vendorLocationMarker.setMap(this.googleMap)
  }

  onSelect() {

    var res = {
      lat: this.vendorLocationMarker.position.lat(), lng : this.vendorLocationMarker.position.lng(), iconUrl: this.iconUrl
    }
    this.data = res;

    this.close(this.data)
  }

  ngOnDestroy(): void {
    if (this.mapClickListener) {
      this.mapClickListener.remove();
    }
  }
}

interface Loc{
  lat: number;
  lng: number;
  iconUrl: string;
}

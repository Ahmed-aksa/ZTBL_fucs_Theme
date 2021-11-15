/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable arrow-parens */
/* eslint-disable no-debugger */
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
import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Lov, LovConfigurationKey } from 'app/shared/classes/lov.class';
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { Branch } from 'app/shared/models/branch.model';
import { Circle } from 'app/shared/models/circle.model';
import { Zone } from 'app/shared/models/zone.model';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { LovService } from 'app/shared/services/lov.service';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { VillageBenchMark } from '../model/village-benchmark.model';
import { VillageWiseBenchMarkingService } from '../service/village-wise-bench-marking.service';

@Component({
  selector: 'app-add-update-bench-marking',
  templateUrl: './add-update-bench-marking.component.html',
  styleUrls: ['./add-update-bench-marking.component.scss']
})
export class AddUpdateBenchMarkingComponent implements OnInit {
    @Input() val: any;
  addUpdateBenchMarkForm: FormGroup;
    farmSizeForVillageWise;

  GenderLov: any;
  LovCall = new Lov();
  user: any = {}
  initCircle = null;

  hasFormErrors = false;
  errorShow = false;

  ind;

  //Zone inventory
  Zones: any = [];
  SelectedZones: any = [];
  public Zone = new Zone();

  //Branch inventory
  Branches: any = [];
  SelectedBranches: any = [];
  public Branch = new Branch();

  //Circle inventory
  Circles: any = [];
  SelectedCircles: any = [];
  public Circle = new Circle();
  selected_b;
  selected_z;
  selected_c;
  LoggedInUserInfo: BaseResponseModel;

  disable_circle = true;
  disable_zone = true;
  disable_branch = true;
  single_branch = true;
  single_circle = true;
  single_zone = true;
  circleCode: any;
  //villageBenchMark = new VillageBenchMark();

  req_array:VillageBenchMark[] = [];
    req_arr;
village=[];
  tableLength: boolean = false;
    updatingCase=false;
  constructor(
    private layoutUtilsService: LayoutUtilsService,
    private router: Router,
    private _villageBenchmark: VillageWiseBenchMarkingService,
    private _lovService: LovService,
    private activatedRoute: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private cdRef: ChangeDetectorRef,
    private userUtilsService: UserUtilsService,
  ) {

      if (this.router.getCurrentNavigation().extras.state !== undefined) {
          console.log(this.router.getCurrentNavigation().extras.state.example)
          this.req_arr = this.router.getCurrentNavigation().extras.state.example;
          this.updatingCase=true;

          // console.log("arr"+JSON.stringify(this.req_arr))
            }
  }

    SubmitSingle(){
        //this.hideDelete = true;

        this.user.ZoneId = this.addUpdateBenchMarkForm.controls.ZoneId.value;
        this.user.BranchCode = this.addUpdateBenchMarkForm.controls.BranchCode.value;
        this.user.CircleId = this.addUpdateBenchMarkForm.controls.CircleId.value;

        // this.village[0].Status="S";


            this.user.ZoneId = this.addUpdateBenchMarkForm.controls.ZoneId.value;
            this.user.BranchCode = this.addUpdateBenchMarkForm.controls.BranchCode.value;
            this.user.CircleId = this.addUpdateBenchMarkForm.controls.CircleId.value;

            this.errorShow = false;
            this.hasFormErrors = false;
            if (this.addUpdateBenchMarkForm.invalid) {
                const controls = this.addUpdateBenchMarkForm.controls;
                Object.keys(controls).forEach(controlName =>
                    controls[controlName].markAsTouched()
                );

                this.hasFormErrors = true;
                return;
            }

            var ef = this.addUpdateBenchMarkForm.controls.EconomicFarmer.value ? Number(this.addUpdateBenchMarkForm.controls.EconomicFarmer.value) : 0,
                sf = this.addUpdateBenchMarkForm.controls.SubsistenceFarmer.value ? Number(this.addUpdateBenchMarkForm.controls.SubsistenceFarmer.value): 0,
                bf = this.addUpdateBenchMarkForm.controls.BigFarmers.value ? Number(this.addUpdateBenchMarkForm.controls.BigFarmers.value): 0,
                male = this.addUpdateBenchMarkForm.controls.MaleCount.value ? Number(this.addUpdateBenchMarkForm.controls.MaleCount.value): 0,
                female = this.addUpdateBenchMarkForm.controls.FemaleCount.value ? Number(this.addUpdateBenchMarkForm.controls.FemaleCount.value): 0,
                transgender = this.addUpdateBenchMarkForm.controls.TransGenderCount.value ? Number(this.addUpdateBenchMarkForm.controls.TransGenderCount.value): 0,
                tot = Number(this.addUpdateBenchMarkForm.controls.NoOfFarmer.value);

            var resF = sf+ef+bf;
            var resG = male+female+transgender;


            if(resF == 0 || tot != resF){
                this.layoutUtilsService.alertElement("", "Economic, Big and Subsistence Farmer value should not be greater or less than No. of Farmers");
                return
            }

            if(resG == 0 || tot != resG){
                this.layoutUtilsService.alertElement("", "Gender MaleCount, Female Count & TransGenderCounts values should not be greater or less than No. of Farmers");
                return
            }

            this.tableLength = true;
            //this.villageBenchMark = Object.assign(this.villageBenchMark, this.addUpdateBenchMarkForm.value);
            if (this.ind == undefined) {
                this.addUpdateBenchMarkForm.controls.Status.setValue("S")
                this.req_array.push(this.addUpdateBenchMarkForm.value)
                console.log(this.req_array)
            } else {
                this.req_array.splice(this.ind, 1);
                this.req_array.splice(this.ind, 0, this.addUpdateBenchMarkForm.value)
            }
            console.log("req"+this.req_array)

        this.spinner.show();
        this._villageBenchmark.addUpdateVillageBenchMark(this.req_array,this.user)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) =>{
                if (baseResponse.Success === true) {
                    //this.req_array = [];
                    //this.req_array = baseResponse.VillageBenchMarking.VillageBenchMarkingList;
                    this.router.navigateByUrl('/village-wise-bench-marking/get-village-bench-marking')
                    //this.req_array = baseResponse.
                    //this.router.navigateByUrl('./get-village-bench-marking')
                }
                else{
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })

    }

  ngOnInit() {
    this.createForm();
    this.LoadLovs();

    this.LoggedInUserInfo = this.userUtilsService.getUserDetails();

    if (this.LoggedInUserInfo.Branch != null) {
      this.disable_circle = false;
      this.Circles = this.LoggedInUserInfo.UserCircleMappings;
      this.SelectedCircles = this.Circles;

      this.Branches = this.LoggedInUserInfo.Branch;
      this.SelectedBranches = this.Branches;

      this.Zone = this.LoggedInUserInfo.Zone;
      this.SelectedZones = this.Zone;

      this.selected_z = this.SelectedZones.ZoneId
      this.selected_b = this.SelectedBranches.BranchCode
      console.log(this.SelectedZones)
      this.addUpdateBenchMarkForm.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
      this.addUpdateBenchMarkForm.controls["BranchCode"].setValue(this.SelectedBranches.Name);
    }else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
      this.spinner.show();

      this.userUtilsService.getZone().subscribe((data: any) => {
          this.Zone = data.Zones;
          this.SelectedZones = this.Zone;
          this.single_zone = false;
          this.disable_zone = false;
          this.spinner.hide();

      });}

  }

  circleChange(event){
    var circle = event;
    this.circleCode = circle.source.triggerValue;

      this.addUpdateBenchMarkForm.controls['CircleCode'].setValue(circle.source.triggerValue);
  }

  createForm(){
    this.addUpdateBenchMarkForm = this.fb.group({
      ZoneId: [null, Validators.required],
      BranchCode: [null, Validators.required],
      CircleId: [null, Validators.required],
        CircleCode:[null, Validators.required],
      Id: [null],
      VillageName: [null, Validators.required],
      NoOfFarmer: [null, Validators.required],
      FarmSize: [null, Validators.required],
        FarmSizeUnit: [null, Validators.required],
      // GenderCount: [null, Validators.required],
      // GenderType: [null, Validators.required],
      MaleCount: [null, Validators.required],
      FemaleCount: [null, Validators.required],
      TransGenderCount: [null, Validators.required],
      AverageLoanSize: [null, Validators.required],
      SubsistenceFarmer: [null],
      EconomicFarmer: [null],
      BigFarmers: [null],
      AgriBusinessPotential: [null,Validators.maxLength(200)],
      Status: [],
    })

      if(this.req_arr){
          console.log("called")
          console.log(this.req_arr["Id"])
          this.addUpdateBenchMarkForm.controls['Id'].setValue(this.req_arr["Id"]);
          this.addUpdateBenchMarkForm.controls['CircleId'].setValue(this.req_arr["CircleId"]);
          this.addUpdateBenchMarkForm.controls['CircleCode'].setValue(this.req_arr["CircleCode"]);
          this.addUpdateBenchMarkForm.controls['VillageName'].setValue(this.req_arr["VillageName"]);
          this.addUpdateBenchMarkForm.controls['NoOfFarmer'].setValue(this.req_arr["NoOfFarmer"]);
          this.addUpdateBenchMarkForm.controls['FarmSize'].setValue(this.req_arr["FarmSize"]);
          // this.addUpdateBenchMarkForm.controls['GenderCount'].setValue(benchmark.GenderCount);
          // this.addUpdateBenchMarkForm.controls['GenderType'].setValue(benchmark.GenderType);
          this.addUpdateBenchMarkForm.controls['MaleCount'].setValue(this.req_arr["MaleCount"]);
          this.addUpdateBenchMarkForm.controls['FemaleCount'].setValue(this.req_arr["FemaleCount"]);
          this.addUpdateBenchMarkForm.controls['TransGenderCount'].setValue(this.req_arr["TransGenderCount"]);
          this.addUpdateBenchMarkForm.controls['AverageLoanSize'].setValue(this.req_arr["AverageLoanSize"]);
          this.addUpdateBenchMarkForm.controls['SubsistenceFarmer'].setValue(this.req_arr["SubsistenceFarmer"]);
          this.addUpdateBenchMarkForm.controls['EconomicFarmer'].setValue(this.req_arr["EconomicFarmer"]);
          this.addUpdateBenchMarkForm.controls['BigFarmers'].setValue(this.req_arr["BigFarmers"]);
          this.addUpdateBenchMarkForm.controls['FarmSizeUnit'].setValue(this.req_arr["FarmSizeUnit"]);
          this.addUpdateBenchMarkForm.controls['AgriBusinessPotential'].setValue(this.req_arr["AgriBusinessPotential"]);

      }
  }


  onAlertClose($event) {
    this.hasFormErrors = false;
  }
  ID;
  update(){
      console.log("id"+this.addUpdateBenchMarkForm.controls.Id.value)
      this.ID=this.addUpdateBenchMarkForm.controls.Id.value;
      this.Add()



  }

  Add() {

    debugger

      this.user.ZoneId = this.addUpdateBenchMarkForm.controls.ZoneId.value;
      this.user.BranchCode = this.addUpdateBenchMarkForm.controls.BranchCode.value;
      this.user.CircleId = this.addUpdateBenchMarkForm.controls.CircleId.value;

    this.errorShow = false;
    this.hasFormErrors = false;
    if (this.addUpdateBenchMarkForm.invalid) {
      const controls = this.addUpdateBenchMarkForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );

      this.hasFormErrors = true;
      return;
    }

    var ef = this.addUpdateBenchMarkForm.controls.EconomicFarmer.value ? Number(this.addUpdateBenchMarkForm.controls.EconomicFarmer.value) : 0,
    sf = this.addUpdateBenchMarkForm.controls.SubsistenceFarmer.value ? Number(this.addUpdateBenchMarkForm.controls.SubsistenceFarmer.value): 0,
    bf = this.addUpdateBenchMarkForm.controls.BigFarmers.value ? Number(this.addUpdateBenchMarkForm.controls.BigFarmers.value): 0,
    male = this.addUpdateBenchMarkForm.controls.MaleCount.value ? Number(this.addUpdateBenchMarkForm.controls.MaleCount.value): 0,
    female = this.addUpdateBenchMarkForm.controls.FemaleCount.value ? Number(this.addUpdateBenchMarkForm.controls.FemaleCount.value): 0,
    transgender = this.addUpdateBenchMarkForm.controls.TransGenderCount.value ? Number(this.addUpdateBenchMarkForm.controls.TransGenderCount.value): 0,
    tot = Number(this.addUpdateBenchMarkForm.controls.NoOfFarmer.value);

     var resF = sf+ef+bf;
     var resG = male+female+transgender;


    if(resF == 0 || tot != resF){
      this.layoutUtilsService.alertElement("", "Economic, Big and Subsistence Farmer value should not be greater or less than No. of Farmers");
      return
    }

    if(resG == 0 || tot != resG){
      this.layoutUtilsService.alertElement("", "Gender MaleCount, Female Count & TransGenderCounts values should not be greater or less than No. of Farmers");
      return
    }

    this.tableLength = true;
    //this.villageBenchMark = Object.assign(this.villageBenchMark, this.addUpdateBenchMarkForm.value);
    if (this.ind == undefined) {
        this.addUpdateBenchMarkForm.controls.Status.setValue("P")
      this.req_array.push(this.addUpdateBenchMarkForm.value)
      console.log(this.req_array)
    } else {
      this.req_array.splice(this.ind, 1);
      this.req_array.splice(this.ind, 0, this.addUpdateBenchMarkForm.value)
    }

      this.spinner.show();
      this._villageBenchmark.addUpdateVillageBenchMark(this.req_array,this.user)
          .pipe(
              finalize(() => {
                  this.isUpdate=false;
                  this.isAdd=true;
                  this.spinner.hide();
              })
          )
          .subscribe((baseResponse: BaseResponseModel) =>{
              if (baseResponse.Success === true) {


                  if(this.ID){
                          console.log("id condition working")

                    console.log("village length"+this.village.length)
                          if (this.village.length) {
                              for (let i = 0;this.village.length; i++) {
                                  if (this.village[i].Id == this.ID) {

                                      this.village.splice(i, 1);
                                      this.ID=null;
                                      break;
                                  }
                              }
                          } else {
                              this.village.splice(0, 1);
                              this.ID=null;
                          }

                  }
                        this.req_array=[]
                  if(this.updatingCase){
                      console.log("called")
                      this.village=[]
                  }
                  console.log(JSON.stringify(baseResponse.VillageBenchMarking["VillageBenchMarkingList"]))
                      this.village.push(baseResponse.VillageBenchMarking["VillageBenchMarkingList"][0]);

console.log("village"+JSON.stringify(this.village))
              }
              else{
                  this.layoutUtilsService.alertElement("", baseResponse.Message);
              }
          })

          if(!this.updatingCase){
          this.addUpdateBenchMarkForm.controls['Id'].reset();
          this.addUpdateBenchMarkForm.controls['CircleId'].reset();
          this.addUpdateBenchMarkForm.controls['CircleCode'].reset();
          this.addUpdateBenchMarkForm.controls['VillageName'].reset();
          this.addUpdateBenchMarkForm.controls['NoOfFarmer'].reset();
          this.addUpdateBenchMarkForm.controls['FarmSize'].reset();
          this.addUpdateBenchMarkForm.controls['FarmSizeUnit'].reset();
          this.addUpdateBenchMarkForm.controls['MaleCount'].reset();
          this.addUpdateBenchMarkForm.controls['FemaleCount'].reset();
          this.addUpdateBenchMarkForm.controls['TransGenderCount'].reset();
          this.addUpdateBenchMarkForm.controls['AverageLoanSize'].reset();
          this.addUpdateBenchMarkForm.controls['SubsistenceFarmer'].reset();
          this.addUpdateBenchMarkForm.controls['EconomicFarmer'].reset();
          this.addUpdateBenchMarkForm.controls['BigFarmers'].reset();
          this.addUpdateBenchMarkForm.controls['AgriBusinessPotential'].reset();
      }

      this.addUpdateBenchMarkForm.markAsUntouched();
      this.addUpdateBenchMarkForm.markAsPristine();
      this.ind = null;

  }

  hideDelete(benchmark) {
    if (benchmark.Id == undefined) {
      return true
    }
    else {
      return false
    }
  }

  clear(){
    this.tableLength = false;
    this.req_array = []

    this.addUpdateBenchMarkForm.controls['CircleId'].reset();
    this.addUpdateBenchMarkForm.controls['CircleCode'].reset();
    this.addUpdateBenchMarkForm.controls['VillageName'].reset();
    this.addUpdateBenchMarkForm.controls['NoOfFarmer'].reset();
    this.addUpdateBenchMarkForm.controls['FarmSize'].reset();
    this.addUpdateBenchMarkForm.controls['FarmSizeUnit'].reset();
    this.addUpdateBenchMarkForm.controls['MaleCount'].reset();
    this.addUpdateBenchMarkForm.controls['FemaleCount'].reset();
    this.addUpdateBenchMarkForm.controls['TransGenderCount'].reset();
    this.addUpdateBenchMarkForm.controls['AverageLoanSize'].reset();
    this.addUpdateBenchMarkForm.controls['SubsistenceFarmer'].reset();
    this.addUpdateBenchMarkForm.controls['EconomicFarmer'].reset();
    this.addUpdateBenchMarkForm.controls['BigFarmers'].reset();
    this.addUpdateBenchMarkForm.controls['AgriBusinessPotential'].reset();

    this.addUpdateBenchMarkForm.markAsUntouched();
    this.addUpdateBenchMarkForm.markAsPristine();
  }
    isUpdate=false;
    isAdd=true
  editRow(benchmark, indx) {
      this.isUpdate=true;
      this.isAdd=false;
    //Well in this case, we have to set value on basis of index and id

    this.ind = indx
    if (benchmark.Id == undefined) {
      this.addUpdateBenchMarkForm.controls['CircleId'].setValue(benchmark.CircleId);
      this.addUpdateBenchMarkForm.controls['CircleCode'].setValue(benchmark.CircleCode);
      this.addUpdateBenchMarkForm.controls['VillageName'].setValue(benchmark.VillageName);
      this.addUpdateBenchMarkForm.controls['NoOfFarmer'].setValue(benchmark.NoOfFarmer);
      this.addUpdateBenchMarkForm.controls['FarmSize'].setValue(benchmark.FarmSize);
        this.addUpdateBenchMarkForm.controls['FarmSizeUnit'].setValue(benchmark.FarmSizeUnit);
      this.addUpdateBenchMarkForm.controls['MaleCount'].setValue(benchmark.MaleCount);
      this.addUpdateBenchMarkForm.controls['FemaleCount'].setValue(benchmark.FemaleCount);
      this.addUpdateBenchMarkForm.controls['TransGenderCount'].setValue(benchmark.TransGenderCount);
      this.addUpdateBenchMarkForm.controls['AverageLoanSize'].setValue(benchmark.AverageLoanSize);
      this.addUpdateBenchMarkForm.controls['SubsistenceFarmer'].setValue(benchmark.SubsistenceFarmer);
      this.addUpdateBenchMarkForm.controls['EconomicFarmer'].setValue(benchmark.EconomicFarmer);
      this.addUpdateBenchMarkForm.controls['BigFarmers'].setValue(benchmark.BigFarmers);
      this.addUpdateBenchMarkForm.controls['AgriBusinessPotential'].setValue(benchmark.AgriBusinessPotential);
    } else {
      let i;
      for (i = 0; i < this.village.length; i++) {
        if (this.village[indx].Id == benchmark.Id) {
          this.addUpdateBenchMarkForm.controls['Id'].setValue(benchmark.Id);
          this.addUpdateBenchMarkForm.controls['CircleId'].setValue(benchmark.CircleId);
            this.addUpdateBenchMarkForm.controls['CircleCode'].setValue(benchmark.CircleCode);
          this.addUpdateBenchMarkForm.controls['VillageName'].setValue(benchmark.VillageName);
          this.addUpdateBenchMarkForm.controls['NoOfFarmer'].setValue(benchmark.NoOfFarmer);
          this.addUpdateBenchMarkForm.controls['FarmSize'].setValue(benchmark.FarmSize);
            this.addUpdateBenchMarkForm.controls['FarmSizeUnit'].setValue(benchmark.FarmSizeUnit);
          this.addUpdateBenchMarkForm.controls['MaleCount'].setValue(benchmark.MaleCount);
          this.addUpdateBenchMarkForm.controls['FemaleCount'].setValue(benchmark.FemaleCount);
          this.addUpdateBenchMarkForm.controls['TransGenderCount'].setValue(benchmark.TransGenderCount);
          this.addUpdateBenchMarkForm.controls['AverageLoanSize'].setValue(benchmark.AverageLoanSize);
          this.addUpdateBenchMarkForm.controls['SubsistenceFarmer'].setValue(benchmark.SubsistenceFarmer);
          this.addUpdateBenchMarkForm.controls['EconomicFarmer'].setValue(benchmark.EconomicFarmer);
          this.addUpdateBenchMarkForm.controls['BigFarmers'].setValue(benchmark.BigFarmers);
          this.addUpdateBenchMarkForm.controls['AgriBusinessPotential'].setValue(benchmark.AgriBusinessPotential);

          // this.village[indx] =benchmark;
        }
      }
    }

  }

  deleteRow(indx,arr) {

       console.log(arr)
      this.spinner.show();
      this._villageBenchmark.deleteVillageBenchmark(arr)
          .pipe(
              finalize(() => {
                  this.spinner.hide();
              })
          )
          .subscribe((baseResponse: BaseResponseModel) =>{
              if (baseResponse.Success === true) {
                  this.village.splice(indx, 1);
                  if (this.village.length == 0) {
                      this.tableLength = false;
                  }
              }
              else{
                  this.layoutUtilsService.alertElement("", baseResponse.Message);
              }
          })

  }

  Submit() {
        debugger
      console.log("village"+JSON.stringify(this.village));
    //this.hideDelete = true;
      if(this.village?.length>0){
for(let i=0;i<this.village.length;i++)
        {
            this.village[i]["Status"]="S";
        }
      }else{
          this.village[0]["Status"]="S";
      }

      console.log("village"+JSON.stringify(this.village));

    this.user.ZoneId = this.addUpdateBenchMarkForm.controls.ZoneId.value;
    this.user.BranchCode = this.addUpdateBenchMarkForm.controls.BranchCode.value;
    this.user.CircleId = this.addUpdateBenchMarkForm.controls.CircleId.value;

    this.spinner.show();
    this._villageBenchmark.addUpdateVillageBenchMark(this.village,this.user)
    .pipe(
      finalize(() => {
      this.spinner.hide();
    })
    )
    .subscribe((baseResponse: BaseResponseModel) =>{
      if (baseResponse.Success === true) {
        //this.req_array = [];
        //this.req_array = baseResponse.VillageBenchMarking.VillageBenchMarkingList;
        this.router.navigateByUrl('/village-wise-bench-marking/get-village-bench-marking')
        //this.req_array = baseResponse.
        //this.router.navigateByUrl('./get-village-bench-marking')
      }
      else{
          this.layoutUtilsService.alertElement("", baseResponse.Message);
      }
    })
  }

  changeBranch(changedValue) {

    let changedBranch = null;
    if (changedValue) {
        changedBranch = {Branch: {BranchCode: changedValue.value}}
    } else {
        changedBranch = {Branch: {BranchCode: changedValue}}

    }
    this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {
        console.log(data);
        this.Circles = data.Circles;
        this.SelectedCircles = this.Circles;
        this.disable_circle = false;
    });
}

    changeZone(changedValue) {
        let changedZone = {Zone: {ZoneId: changedValue.value}}
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.Branches = data.Branches;
            this.SelectedBranches = this.Branches;
            this.single_branch = false;
            this.disable_branch = false;
        });
    }

    async LoadLovs() {
        this.GenderLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Gender});
        this.GenderLov = this.GenderLov.LOVs;

        this.farmSizeForVillageWise = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.FarmSizeForVillageWise})
        this.farmSizeForVillageWise.LOVs.forEach(function (value) {
            if (!value.Value)
                value.Value = "All";
        });
    }

}

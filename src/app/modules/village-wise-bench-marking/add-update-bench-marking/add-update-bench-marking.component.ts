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
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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

  addUpdateBenchMarkForm: FormGroup;
  

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
  tableLength: boolean = false;

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
  ) { }

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
  }

  createForm(){
    this.addUpdateBenchMarkForm = this.fb.group({
      ZoneId: [null, Validators.required],
      BranchCode: [null, Validators.required],
      CircleId: [null, Validators.required],
      Id: [null],
      VillageName: [null, Validators.required],
      NoOfFormaer: [null, Validators.required],
      FarmSize: [null, Validators.required],
      Male: [null, Validators.required],
      Female: [null, Validators.required],
      Transgender: [null, Validators.required],
      AverageLoanSize: [null, Validators.required],
      SubsistenceFarmer: [null],
      EconomicFarmer: [null],
      BigFarmars: [null],
      AgriBusinessPotential: [null],
      Status: ['S']
    })
  }

  async LoadLovs(){
    this.GenderLov = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.Gender});
    this.GenderLov = this.GenderLov.LOVs;
    console.log(this.GenderLov)
  }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  Add() {
    debugger
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
    bf = this.addUpdateBenchMarkForm.controls.BigFarmars.value ? Number(this.addUpdateBenchMarkForm.controls.BigFarmars.value): 0,
    male = this.addUpdateBenchMarkForm.controls.Male.value ? Number(this.addUpdateBenchMarkForm.controls.Male.value): 0,
    female = this.addUpdateBenchMarkForm.controls.Female.value ? Number(this.addUpdateBenchMarkForm.controls.Female.value): 0,
    transgender = this.addUpdateBenchMarkForm.controls.Transgender.value ? Number(this.addUpdateBenchMarkForm.controls.Transgender.value): 0,
    tot = Number(this.addUpdateBenchMarkForm.controls.NoOfFormaer.value);

    var resF = sf+ef+bf, resG = male+female+transgender;
    
    if(resF != 0 && tot != resF){
      this.layoutUtilsService.alertElement("", "Economic, Big and Subsistence Farmer value should not be greater or less than No. of Farmers");
      return
    }

    if(resG != 0 && tot != resG){
      this.layoutUtilsService.alertElement("", "Gender Male, Female & Transgenders values should not be greater or less than No. of Farmers");
      return
    }

    this.tableLength = true;
    //this.villageBenchMark = Object.assign(this.villageBenchMark, this.addUpdateBenchMarkForm.value);
    if (this.ind == undefined) {
      this.req_array.push(this.addUpdateBenchMarkForm.value)
      console.log(this.req_array)
    } else {
      this.req_array.splice(this.ind, 1);
      this.req_array.splice(this.ind, 0, this.addUpdateBenchMarkForm.value)
    }

    this.addUpdateBenchMarkForm.controls['Id'].reset();
    this.addUpdateBenchMarkForm.controls['CircleId'].reset();
    this.addUpdateBenchMarkForm.controls['VillageName'].reset();
    this.addUpdateBenchMarkForm.controls['NoOfFormaer'].reset();
    this.addUpdateBenchMarkForm.controls['FarmSize'].reset();
    this.addUpdateBenchMarkForm.controls['Male'].reset();
    this.addUpdateBenchMarkForm.controls['Female'].reset();
    this.addUpdateBenchMarkForm.controls['Transgender'].reset();
    this.addUpdateBenchMarkForm.controls['AverageLoanSize'].reset();
    this.addUpdateBenchMarkForm.controls['SubsistenceFarmer'].reset();
    this.addUpdateBenchMarkForm.controls['EconomicFarmer'].reset();
    this.addUpdateBenchMarkForm.controls['BigFarmars'].reset();
    this.addUpdateBenchMarkForm.controls['AgriBusinessPotential'].reset();
      

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
    this.addUpdateBenchMarkForm.controls['VillageName'].reset();
    this.addUpdateBenchMarkForm.controls['NoOfFormaer'].reset();
    this.addUpdateBenchMarkForm.controls['FarmSize'].reset();
    this.addUpdateBenchMarkForm.controls['Male'].reset();
    this.addUpdateBenchMarkForm.controls['Female'].reset();
    this.addUpdateBenchMarkForm.controls['Transgender'].reset();
    this.addUpdateBenchMarkForm.controls['AverageLoanSize'].reset();
    this.addUpdateBenchMarkForm.controls['SubsistenceFarmer'].reset();
    this.addUpdateBenchMarkForm.controls['EconomicFarmer'].reset();
    this.addUpdateBenchMarkForm.controls['BigFarmars'].reset();
    this.addUpdateBenchMarkForm.controls['AgriBusinessPotential'].reset();

    this.addUpdateBenchMarkForm.markAsUntouched();
    this.addUpdateBenchMarkForm.markAsPristine();
  }

  editRow(benchmark, indx) {
    //Well in this case, we have to set value on basis of index and id

    this.ind = indx

    if (benchmark.Id == undefined) {
      this.addUpdateBenchMarkForm.controls['CircleId'].setValue(benchmark.CircleId);
      this.addUpdateBenchMarkForm.controls['VillageName'].setValue(benchmark.VillageName);
      this.addUpdateBenchMarkForm.controls['NoOfFormaer'].setValue(benchmark.NoOfFormaer);
      this.addUpdateBenchMarkForm.controls['FarmSize'].setValue(benchmark.FarmSize);
      this.addUpdateBenchMarkForm.controls['Male'].setValue(benchmark.Male);
      this.addUpdateBenchMarkForm.controls['Female'].setValue(benchmark.Female);
      this.addUpdateBenchMarkForm.controls['Transgender'].setValue(benchmark.Transgender);
      this.addUpdateBenchMarkForm.controls['AverageLoanSize'].setValue(benchmark.AverageLoanSize);
      this.addUpdateBenchMarkForm.controls['SubsistenceFarmer'].setValue(benchmark.SubsistenceFarmer);
      this.addUpdateBenchMarkForm.controls['EconomicFarmer'].setValue(benchmark.EconomicFarmer);
      this.addUpdateBenchMarkForm.controls['BigFarmars'].setValue(benchmark.BigFarmars);
      this.addUpdateBenchMarkForm.controls['AgriBusinessPotential'].setValue(benchmark.AgriBusinessPotential);
    } else {
      let i;
      for (i = 0; i < this.req_array.length; i++) {
        if (this.req_array[indx].Id == benchmark.Id) {
          this.addUpdateBenchMarkForm.controls['Id'].setValue(benchmark.Id);
          this.addUpdateBenchMarkForm.controls['CircleId'].setValue(benchmark.CircleId);
          this.addUpdateBenchMarkForm.controls['VillageName'].setValue(benchmark.VillageName);
          this.addUpdateBenchMarkForm.controls['NoOfFormaer'].setValue(benchmark.NoOfFormaer);
          this.addUpdateBenchMarkForm.controls['FarmSize'].setValue(benchmark.FarmSize);
          this.addUpdateBenchMarkForm.controls['Male'].setValue(benchmark.Male);
          this.addUpdateBenchMarkForm.controls['Female'].setValue(benchmark.Female);
          this.addUpdateBenchMarkForm.controls['Transgender'].setValue(benchmark.Transgender);
          this.addUpdateBenchMarkForm.controls['AverageLoanSize'].setValue(benchmark.AverageLoanSize);
          this.addUpdateBenchMarkForm.controls['SubsistenceFarmer'].setValue(benchmark.SubsistenceFarmer);
          this.addUpdateBenchMarkForm.controls['EconomicFarmer'].setValue(benchmark.EconomicFarmer);
          this.addUpdateBenchMarkForm.controls['BigFarmars'].setValue(benchmark.BigFarmars);
          this.addUpdateBenchMarkForm.controls['AgriBusinessPotential'].setValue(benchmark.AgriBusinessPotential);
        }
      }
    }
  }

  deleteRow(indx) {
    this.req_array.splice(indx, 1);
    if (this.req_array.length == 0) {
      this.tableLength = false;
    }
  }

  Submit() {

    //this.hideDelete = true;

    
    this.user.ZoneId = this.addUpdateBenchMarkForm.controls.ZoneId.value;
    this.user.BranchCode = this.addUpdateBenchMarkForm.controls.BranchCode.value;
    this.user.CircleId = this.addUpdateBenchMarkForm.controls.CircleId.value;

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
        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
        this.router.navigateByUrl('/village-wise-bench-marking/get-village-bench-marking')
        //console.log(baseResponse)
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
    if (changedValue.has('value')) {
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

}

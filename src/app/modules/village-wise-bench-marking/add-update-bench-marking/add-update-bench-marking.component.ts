/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable arrow-parens */
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
import {ChangeDetectorRef, Component, Input, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Lov, LovConfigurationKey} from 'app/shared/classes/lov.class';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {VillageBenchMark} from '../model/village-benchmark.model';
import {VillageWiseBenchMarkingService} from '../service/village-wise-bench-marking.service';
import {Activity} from "../../../shared/models/activity.model";

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

    zone: any;
    branch: any;
    circle: any;


    LoggedInUserInfo: BaseResponseModel;

    disable_circle = true;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    single_zone = true;
    //villageBenchMark = new VillageBenchMark();

    req_array: VillageBenchMark[] = [];
    req_arr;
    village = [];
    tableLength: boolean = false;
    updatingCase = false;

    is_view: boolean = false;
    currentActivity: Activity
    ID;
    isUpdate = false;
    isAdd = true

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
        if (this.router.getCurrentNavigation()?.extras?.state !== undefined) {
            this.req_arr = this.router.getCurrentNavigation().extras.state.example;
            this.is_view = this.router.getCurrentNavigation().extras.state.hide;
            this.updatingCase = true;

            // )
        } else {
            this.is_view = true;

        }
    }

    SubmitSingle() {
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
            sf = this.addUpdateBenchMarkForm.controls.SubsistenceFarmer.value ? Number(this.addUpdateBenchMarkForm.controls.SubsistenceFarmer.value) : 0,
            bf = this.addUpdateBenchMarkForm.controls.BigFarmers.value ? Number(this.addUpdateBenchMarkForm.controls.BigFarmers.value) : 0,
            male = this.addUpdateBenchMarkForm.controls.MaleCount.value ? Number(this.addUpdateBenchMarkForm.controls.MaleCount.value) : 0,
            female = this.addUpdateBenchMarkForm.controls.FemaleCount.value ? Number(this.addUpdateBenchMarkForm.controls.FemaleCount.value) : 0,
            transgender = this.addUpdateBenchMarkForm.controls.TransGenderCount.value ? Number(this.addUpdateBenchMarkForm.controls.TransGenderCount.value) : 0,
            tot = Number(this.addUpdateBenchMarkForm.controls.NoOfFarmer.value);

        var resF = sf + ef + bf;
        var resG = male + female + transgender;


        if (resF == 0 || tot != resF) {
            this.layoutUtilsService.alertElement("", "Economic, Big and Subsistence Farmer value should not be greater or less than No. of Farmers");
            return
        }

        if (resG == 0 || tot != resG) {
            this.layoutUtilsService.alertElement("", "Gender MaleCount, Female Count & TransGenderCounts values should not be greater or less than No. of Farmers");
            return
        }

        this.tableLength = true;
        //this.villageBenchMark = Object.assign(this.villageBenchMark, this.addUpdateBenchMarkForm.value);
        if (this.ind == undefined) {
            this.addUpdateBenchMarkForm.controls.Status.setValue("S")
            this.req_array.push(this.addUpdateBenchMarkForm.value)

        } else {
            this.req_array.splice(this.ind, 1);
            this.req_array.splice(this.ind, 0, this.addUpdateBenchMarkForm.value)
        }


        this.spinner.show();
        this._villageBenchmark.addUpdateVillageBenchMark(this.req_array, this.user)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    //this.req_array = [];
                    //this.req_array = baseResponse.VillageBenchMarking.VillageBenchMarkingList;
                    this.router.navigateByUrl('/village-wise-bench-marking/get-village-bench-marking')
                    //this.req_array = baseResponse.
                    //this.router.navigateByUrl('./get-village-bench-marking')
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })

    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
        if (this.circle)
            this.addUpdateBenchMarkForm.controls['CircleCode'].setValue(this.circle?.CircleCode);


    }

    ngOnInit() {
        this.currentActivity = this.userUtilsService.getActivity('Add Update Bench Marking')
        this.createForm();
        this.LoadLovs();

    }

    createForm() {
        this.addUpdateBenchMarkForm = this.fb.group({
            ZoneId: [null, Validators.required],
            BranchCode: [null, Validators.required],
            CircleId: [null, Validators.required],
            CircleCode: [null, Validators.required],
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
            SubsistenceFarmer: [null, Validators.required],
            EconomicFarmer: [null, Validators.required],
            BigFarmers: [null, Validators.required],
            AgriBusinessPotential: [null, Validators.maxLength(200)],
            Status: [],
        })

        if (this.req_arr) {
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

    update() {

        this.ID = this.addUpdateBenchMarkForm.controls.Id.value;
        this.Add()


    }

    Add() {


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
            sf = this.addUpdateBenchMarkForm.controls.SubsistenceFarmer.value ? Number(this.addUpdateBenchMarkForm.controls.SubsistenceFarmer.value) : 0,
            bf = this.addUpdateBenchMarkForm.controls.BigFarmers.value ? Number(this.addUpdateBenchMarkForm.controls.BigFarmers.value) : 0,
            male = this.addUpdateBenchMarkForm.controls.MaleCount.value ? Number(this.addUpdateBenchMarkForm.controls.MaleCount.value) : 0,
            female = this.addUpdateBenchMarkForm.controls.FemaleCount.value ? Number(this.addUpdateBenchMarkForm.controls.FemaleCount.value) : 0,
            transgender = this.addUpdateBenchMarkForm.controls.TransGenderCount.value ? Number(this.addUpdateBenchMarkForm.controls.TransGenderCount.value) : 0,
            tot = Number(this.addUpdateBenchMarkForm.controls.NoOfFarmer.value);

        var resF = sf + ef + bf;
        var resG = male + female + transgender;


        if (resF == 0 || tot != resF) {
            this.layoutUtilsService.alertElement("", "Economic, Big and Subsistence Farmer value should not be greater or less than No. of Farmers");
            return
        }

        if (resG == 0 || tot != resG) {
            this.layoutUtilsService.alertElement("", "Gender MaleCount, Female Count & TransGenderCounts values should not be greater or less than No. of Farmers");
            return
        }

        this.tableLength = true;
        //this.villageBenchMark = Object.assign(this.villageBenchMark, this.addUpdateBenchMarkForm.value);
        if (this.ind == undefined) {
            this.addUpdateBenchMarkForm.controls.Status.setValue("P")
            this.req_array.push(this.addUpdateBenchMarkForm.value)

        } else {
            this.req_array.splice(this.ind, 1);
            this.req_array.splice(this.ind, 0, this.addUpdateBenchMarkForm.value)
        }

        this.spinner.show();
        this._villageBenchmark.addUpdateVillageBenchMark(this.req_array, this.user)
            .pipe(
                finalize(() => {
                    this.isUpdate = false;
                    this.isAdd = true;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {


                    if (this.ID) {


                        if (this.village.length) {
                            for (let i = 0; this.village.length; i++) {
                                if (this.village[i].Id == this.ID) {

                                    this.village.splice(i, 1);
                                    this.ID = null;
                                    break;
                                }
                            }
                        } else {
                            this.village.splice(0, 1);
                            this.ID = null;
                        }

                    }
                    this.req_array = []
                    if (this.updatingCase) {

                        this.village = []
                    }
                    this.village.push(baseResponse.VillageBenchMarking["VillageBenchMarkingList"][0]);

                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })

        if (!this.updatingCase) {
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
        } else {
            return false
        }
    }

    clear() {
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

    editRow(benchmark, indx) {
        this.isUpdate = true;
        this.isAdd = false;
        //Well in this case, we have to set value on basis of index and id

        this.ind = indx
        if (benchmark.Id == undefined) {
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

    deleteRow(indx, arr) {


        this.spinner.show();
        this._villageBenchmark.deleteVillageBenchmark(arr)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.village.splice(indx, 1);
                    if (this.village.length == 0) {
                        this.tableLength = false;
                    }
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })

    }

    Submit() {
        //this.hideDelete = true;
        if (this.village?.length > 0) {
            for (let i = 0; i < this.village.length; i++) {
                this.village[i]["Status"] = "S";
            }
        } else {
            this.village[0]["Status"] = "S";
        }


        this.user.ZoneId = this.addUpdateBenchMarkForm.controls.ZoneId.value;
        this.user.BranchCode = this.addUpdateBenchMarkForm.controls.BranchCode.value;
        this.user.CircleId = this.addUpdateBenchMarkForm.controls.CircleId.value;

        this.spinner.show();
        this._villageBenchmark.addUpdateVillageBenchMark(this.village, this.user)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    //this.req_array = [];
                    //this.req_array = baseResponse.VillageBenchMarking.VillageBenchMarkingList;
                    this.router.navigateByUrl('/village-wise-bench-marking/get-village-bench-marking')
                    //this.req_array = baseResponse.
                    //this.router.navigateByUrl('./get-village-bench-marking')
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
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

/* eslint-disable eqeqeq */
/* eslint-disable arrow-parens */
/* eslint-disable prefer-const */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { Lov, LovConfigurationKey } from 'app/shared/classes/lov.class';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import { finalize } from 'rxjs/operators';
import { Bufrication } from '../class/reports';
import { ReportsService } from '../service/reports.service';

@Component({
    selector: 'bufrication-of-os-balances-lc',
    templateUrl: './bufrication-of-os-balances-lc.component.html',
    styleUrls: ['./bufrication-of-os-balances-lc.component.scss']
})
export class BufricationOfOsBalancesLcComponent implements OnInit {

    bufricationForm: FormGroup;
    selected_b;
    selected_z;
    selected_c;
    loaded = true;
    disable_circle = true;
    disable_zone = true;
    disable_branch = true;
    single_branch = true;
    single_circle = true;
    single_zone = true;
    LoggedInUserInfo: BaseResponseModel;
    statusLov: any;
    loading = false;

    public reports = new Bufrication();


    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];

    final_branch: any;
    final_zone: any;

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];

    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];

    user: any = {}

    constructor(
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private _lovService: LovService,
        private _bufrication: ReportsService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
    ) {
    }

    public LovCall = new Lov();

    select: Selection[] = [
      {Value: '2', description: 'Portable Document Format (PDF)'},
      {Value: '1', description: 'MS Excel (Formatted)'},
      {Value: '3', description: 'MS Excel (Data Only Non Formatted)'}
  ];

    ngOnInit(): void {
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();
        console.log(this.LoggedInUserInfo)
        this.typeLov();
        if (this.LoggedInUserInfo.Branch != null) {
            //this.Circles = this.LoggedInUserInfo.UserCircleMappings;
            this.SelectedCircles = this.Circles;
            this.disable_circle = false;

            this.Branches = this.LoggedInUserInfo.Branch;
            this.SelectedBranches = this.Branches;

            this.Zones = this.LoggedInUserInfo.Zone;
            this.SelectedZones = this.Zones;

            this.selected_z = this.SelectedZones.ZoneId
            this.selected_b = this.SelectedBranches.BranchCode
            this.selected_c = this.SelectedCircles.Id
            console.log(this.SelectedZones)
            this.bufricationForm.controls["ZoneId"].setValue(this.SelectedZones?.Id);
            this.bufricationForm.controls["BranchCode"].setValue(this.SelectedBranches?.Name);
            this.changeBranch(this.selected_b);
            var fi: any = []
            fi.Id = "null";
            fi.CircleCode = "----Please Select----";
            fi.LovId = "0";
            fi.TagName = "0";
            this.SelectedCircles.splice(0, 0, fi)
            console.log(this.SelectedCircles)
            this.bufricationForm.controls["CircleId"].setValue(this.SelectedCircles ? this.SelectedCircles[0].Id : "")
        } else if (!this.LoggedInUserInfo.Branch && !this.LoggedInUserInfo.Zone && !this.LoggedInUserInfo.Zone) {
            this.spinner.show();

            this.userUtilsService.getZone().subscribe((data: any) => {
                this.Zones = data.Zones;
                this.SelectedZones = this.Zones;
                this.single_zone = false;
                this.disable_zone = false;
                this.spinner.hide();

            });
        }
    }

    async typeLov(){
      this.statusLov = await this._lovService.CallLovAPI(this.LovCall = { TagName: LovConfigurationKey.BifurcationLCStatus });
      this.statusLov = this.statusLov.LOVs;
      this.bufricationForm.controls["AccountStatus"].setValue(this.statusLov ? this.statusLov[0].Value : "")
      console.log(this.statusLov)
    }

    private assignBranchAndZone() {

      //Branch
      if (this.SelectedBranches.length) {
          this.final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0];
          this.LoggedInUserInfo.Branch = this.final_branch;
      } else {
          this.final_branch = this.SelectedBranches;
          this.LoggedInUserInfo.Branch = this.final_branch;
      }
      //Zone
      if (this.SelectedZones.length) {
          this.final_zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
          this.LoggedInUserInfo.Zone = this.final_zone;
      } else {
          this.final_zone = this.SelectedZones;
          this.LoggedInUserInfo.Zone = this.final_zone;
      }

  }

    createForm() {
        this.bufricationForm = this.fb.group({
            ZoneId: [null, Validators.required],
            BranchCode: [null, Validators.required],
            WorkingDate: ['11012021', Validators.required],
            LcNo: [null, Validators.required],
            CircleId: [null, Validators.required],
            Status: [null, Validators.required],
            ReportFormatType: [null, Validators.required],
            PPNO: [null, Validators.required]
        })
    }

    changeZone(changedValue) {
        let changedZone = {Zone: {ZoneId: changedValue.value}}
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.Branches = data.Branches;
            console.log(this.Branches)
            this.SelectedBranches = this.Branches;
            this.single_branch = false;
            this.disable_branch = false;
        });
    }

    find() {
      this.assignBranchAndZone();
      this.user.Branch = this.final_branch;
      this.user.Zone = this.final_zone;
      this.bufricationForm.controls["PPNO"].setValue(this.LoggedInUserInfo.User.UserName);

      this.reports = Object.assign(this.reports, this.bufricationForm.value);
        this.reports.ReportsNo = "18";
        this.spinner.show();
        this._bufrication.reportDynamic(this.user, this.reports)
            .pipe(
                finalize(() => {
                    this.loaded = true;
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: any) => {
                if (baseResponse.Success === true) {
                  window.open(baseResponse.ReportsFilterCustom.FilePath,'Download');
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }


    changeBranch(changedValue) {

        let changedBranch = null;
        if (changedValue.value) {
            changedBranch = {Branch: {BranchCode: changedValue.value}}
        } else {
            changedBranch = {Branch: {BranchCode: changedValue}}

        }
        this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {
            console.log(data);
            this.Circles = data.Circles;
            this.SelectedCircles = this.Circles;
            var fi: any = []
            fi.Id = "null";
            fi.CircleCode = "----Please Select----";
            fi.LovId = "0";
            fi.TagName = "0";
            this.SelectedCircles.splice(0, 0, fi)
            console.log(this.SelectedCircles)
            this.bufricationForm.controls["CircleId"].setValue(this.SelectedCircles ? this.SelectedCircles[0].Id : "")
            this.disable_circle = false;
        });
    }


}

export interface Selection {
  Value: string;
  description: string;
}

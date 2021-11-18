import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LovService} from 'app/shared/services/lov.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';

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

    //Zone inventory
    Zones: any = [];
    SelectedZones: any = [];

    //Branch inventory
    Branches: any = [];
    SelectedBranches: any = [];

    //Circle inventory
    Circles: any = [];
    SelectedCircles: any = [];

    constructor(
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
    ) {
    }

    ngOnInit(): void {
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.createForm();
        console.log(this.LoggedInUserInfo)
        if (this.LoggedInUserInfo.Branch != null) {
            this.Circles = this.LoggedInUserInfo.UserCircleMappings;
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
            var fi: any = []
            fi.Id = "null";
            fi.CircleCode = "Please Select----";
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

    createForm() {
        this.bufricationForm = this.fb.group({
            ZoneId: [],
            BranchCode: [],
            WorkingDate: [],
            LcNo: [],
            CircleId: [],
            AccountStatus: [],
            ExportFormat: []
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
            var fi: any = []
            fi.Id = "null";
            fi.CircleCode = "Please Select----";
            fi.LovId = "0";
            fi.TagName = "0";
            this.SelectedCircles.splice(0, 0, fi)
            console.log(this.SelectedCircles)
            this.bufricationForm.controls["CircleId"].setValue(this.SelectedCircles ? this.SelectedCircles[0].Id : "")
            this.disable_circle = false;
        });
    }


}

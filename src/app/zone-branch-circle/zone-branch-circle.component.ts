/* eslint-disable @typescript-eslint/naming-convention */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserUtilsService} from "../shared/services/users_utils.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-zone-branch-circle',
    templateUrl: './zone-branch-circle.component.html',
    styleUrls: ['./zone-branch-circle.component.scss']
})
export class ZoneBranchCircleComponent implements OnInit {

    @Input('form') form;
    @Input('should_show_circle') should_show_circle;
    @Output() branchZoneCircleData = new EventEmitter<{
        final_zone: any
        final_branch: any,
        final_circle: any,
    }>();

    all_data: any;

    /**
     * Circles
     */
    SelectedCircles: any;
    selected_c: any;
    single_circle = true;

    /**
     *Branches
     */
    SelectedBranches: any;
    selected_b: any;
    single_branch = true;

    /**
     * Zones
     */
    SelectedZones: any;
    selected_z: any;
    single_zone = true;

    constructor(private userUtilsService: UserUtilsService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    }

    ngOnInit(): void {
        this.addFormControls(this.should_show_circle);
        this.all_data = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        if (this.all_data.Branch && this.all_data.Zone && this.all_data.UserCircleMappings) {

            this.SelectedBranches = this.all_data.Branch;
            this.SelectedZones = this.all_data.Zone;
            this.SelectedCircles = this.all_data.UserCircleMappings;
            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.selected_c = this.SelectedCircles?.Id
            this.form.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
            this.form.controls["BranchCode"].setValue(this.SelectedBranches.BranchCode);

            this.single_circle = false;
            this.emitData();

        } else if (this.all_data.Branch && this.all_data.Zone && !this.all_data.UserCircleMappings) {
            this.SelectedBranches = this.all_data.Branch;
            this.SelectedZones = this.all_data.Zone;

            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.selected_c = this.SelectedCircles?.Id
            this.form.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
            this.form.controls["BranchCode"].setValue(this.SelectedBranches.BranchCode);
            if (this.form.value.BranchCode) {
                this.changeBranch(this.selected_b);
            }
            this.emitData();

        } else if (!this.all_data.Branch && this.all_data.Zone && !this.all_data.UserCircleMappings) {
            this.SelectedZones = this.all_data.Zone;
            this.selected_z = this.SelectedZones?.ZoneId;
            this.form.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
            this.changeZone(this.selected_z);

        } else if (!this.all_data.Branch && !this.all_data.Zone && !this.all_data.Zone) {
            this.spinner.show();

            this.userUtilsService.getZone().subscribe((data: any) => {
                this.SelectedZones = data.Zones;
                this.single_zone = false;
                this.single_zone = false;
                this.spinner.hide();

            });


        }
        this.emitData();
    }

    changeBranch(changedValue) {
        this.selected_c = null;
        let changedBranch = null;
        if (changedValue.value)
            changedBranch = {Branch: {BranchCode: changedValue.value}}
        else
            changedBranch = {Branch: {BranchCode: changedValue}}
        this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {
            this.SelectedCircles = data.Circles;
            this.single_circle = false;
        });
        this.emitData();
    }

    changeZone(changedValue) {
        this.selected_b = null;
        this.selected_c = null;
        let changedZone = null;
        if (changedValue.value) {
            changedZone = {Zone: {ZoneId: changedValue.value}}
        } else {
            changedZone = {Zone: {ZoneId: changedValue}}
        }
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.SelectedBranches = data.Branches;
            this.single_branch = false;
        });
        this.emitData();

    }

    private addFormControls(should_show_circle) {
        this.form.addControl('ZoneId', new FormControl(null, Validators.required))
        this.form.addControl('BranchCode', new FormControl(null))
        if (should_show_circle)
            this.form.addControl('CircleId', new FormControl(null))
    }

    // eslint-disable-next-line @typescript-eslint/member-ordering
    emitData() {
        let final_zone = null;
        if (this.SelectedZones?.length > 1)
            final_zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
        else final_zone = this.SelectedZones
        let final_branch = null;
        if (this.SelectedBranches?.length > 1)
            final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0];
        else final_branch = this.SelectedBranches


        let final_circle = null;
        debugger;

        if (this.SelectedCircles?.length > 1)
            final_circle = this.SelectedCircles?.filter((circ) => circ.Id == this.selected_c)[0]
        else if(this.SelectedCircles.length==1)
            final_circle=this.SelectedCircles[0];
        else
            final_circle = this.SelectedCircles;
        this.branchZoneCircleData.emit({
            final_zone: final_zone,
            final_branch: final_branch,
            final_circle: final_circle
        });
    }

    changeCircle(event) {
        this.emitData();
    }

    checkZoneValidation() {
        if (this.form.invalid) {
            this.toastr.error("Please enter required values");
            return;
        }
    }
}

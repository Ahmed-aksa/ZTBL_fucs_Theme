import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserUtilsService} from "../shared/services/users_utils.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";

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

    constructor(private userUtilsService: UserUtilsService, private spinner: NgxSpinnerService) {
    }

    ngOnInit(): void {
        this.addFormControls(this.should_show_circle);
        this.all_data = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        if (this.all_data.Branch && this.all_data.Branch.BranchCode != "All") {
            this.SelectedCircles = this.all_data.UserCircleMappings;
            this.SelectedBranches = this.all_data.Branch;
            this.SelectedZones = this.all_data.Zone;

            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.selected_c = this.SelectedCircles?.Id
            this.form.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
            this.form.controls["BranchCode"].setValue(this.SelectedBranches.BranchCode);
            if (this.form.value.BranchCode) {
                this.changeBranch(this.form.value.BranchCode)
            }

        } else if (!this.all_data.Branch && !this.all_data.Zone && !this.all_data.Zone) {
            this.spinner.show();

            this.userUtilsService.getZone().subscribe((data: any) => {
                this.SelectedZones = data.Zones;
                this.single_zone = false;
                this.single_zone = false;
                this.spinner.hide();

            });


        }
    }

    changeBranch(changedValue) {
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
        let changedZone = {Zone: {ZoneId: changedValue.value}}
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            let branch = data.Branches;
            this.SelectedBranches = branch;
            this.single_branch = false;
        });
        this.emitData();

    }

    private addFormControls(should_show_circle) {
        this.form.addControl('ZoneId', new FormControl(null, Validators.required))
        this.form.addControl('BranchCode', new FormControl(null, Validators.required))
        if (should_show_circle)
            this.form.addControl('CircleId', new FormControl(null, Validators.required))
    }

    emitData() {
        let final_zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
        let final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0];
        let final_circle = this.SelectedCircles?.filter((circ) => circ.Id == this.selected_c)[0]

        this.branchZoneCircleData.emit({
            final_zone: final_zone,
            final_branch: final_branch,
            final_circle: final_circle
        })
    }

    changeCircle(event) {
        this.emitData();
    }
}

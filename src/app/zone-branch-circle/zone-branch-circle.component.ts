/* eslint-disable @typescript-eslint/naming-convention */
import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {UserUtilsService} from "../shared/services/users_utils.service";
import {FormControl, Validators} from "@angular/forms";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-zone-branch-circle',
    templateUrl: './zone-branch-circle.component.html',
    styleUrls: ['./zone-branch-circle.component.scss']
})
export class ZoneBranchCircleComponent implements OnInit {

    @Input('form') form;
    @Input('should_filter') should_filter = true;
    @Input('show_circle') incoming_circle = null;
    show_circle = true;
    @Input('is_required_circle') is_required_circle;
    @Input('should_hide_fields') should_hide_fields;
    @Input('required_branch') required_branch = true;
    @Input('required_zone') required_zone = true;
    @Input('show_branch') incoming_branch = null;
    show_branch = true;
    @Input('show_zone') show_zone = true;
    //@Input('show_circle') show_circle=true;
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
    selected_single_circle = null;
    selected_single_zone = null;
    selected_single_branch = null;

    constructor(private userUtilsService: UserUtilsService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    }

    ngOnInit(): void {

        if (localStorage.getItem('selected_single_zone')) {
            this.selected_single_zone = JSON.parse(localStorage.getItem('selected_single_zone'));
        }
        if (localStorage.getItem('selected_single_branch')) {
            this.selected_single_branch = JSON.parse(localStorage.getItem('selected_single_branch'));
        }
        if (localStorage.getItem('selected_single_circle')) {
            this.selected_single_circle = JSON.parse(localStorage.getItem('selected_single_circle'));

        }

        this.addFormControls();
        this.all_data = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        if (this.all_data.UserCircleMappings?.length == 0) {
            this.all_data.UserCircleMappings = null;
        }
        if (this.all_data.Branch && this.all_data.Zone && this.all_data.UserCircleMappings) {

            this.SelectedBranches = this.all_data.Branch;
            this.SelectedZones = this.all_data.Zone;
            this.SelectedCircles = this.all_data.UserCircleMappings;
            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.selected_c = this.SelectedCircles?.Id
            this.form.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
            this.form.controls["BranchCode"].setValue(this.SelectedBranches.BranchCode);

            if (!this.incoming_circle && this.incoming_circle != true && !this.selected_b) {
                this.show_circle = false
            }
            if ((!this.incoming_branch && this.incoming_branch != true) && !this.selected_b) {
                this.show_branch = false
            }
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
            this.show_circle = false;
            if (this.form.value.BranchCode) {
                this.changeBranch(this.selected_b);
            }
            this.emitData();

        } else if (!this.all_data.Branch && this.all_data.Zone && !this.all_data.UserCircleMappings) {
            if (!this.incoming_circle && this.incoming_circle != true)
                this.show_circle = false;
            if (!this.incoming_branch && this.incoming_branch != true)
                this.show_branch = false;
            this.SelectedZones = this.all_data.Zone;
            this.selected_z = this.SelectedZones?.ZoneId;
            this.form.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
            this.changeZone(this.selected_z);

        } else if (!this.all_data.Branch && !this.all_data.Zone && !this.all_data.UserCircleMappings) {
            this.spinner.show();

            this.userUtilsService.getZone().subscribe((data: any) => {
                this.SelectedZones = data.Zones;
                this.single_zone = false;
                this.single_zone = false;
                this.spinner.hide();
                if (!this.incoming_circle && this.incoming_circle != true)
                    this.show_circle = false;
                if (!this.incoming_branch && this.incoming_branch != true)
                    this.show_branch = false;
            });


        }
        if (localStorage.getItem('selected_single_zone')) {
            this.spinner.show();

            if (this.SelectedZones && this.SelectedZones.length != 0) {
                this.SelectedCircles?.filter(single_circle => {
                    if (single_circle.CircleId == this.selected_single_circle) {
                        this.selected_c = this.selected_single_circle;
                    }
                });
                localStorage.removeItem('selected_single_zone');
                localStorage.removeItem('selected_single_branch');
                localStorage.removeItem('selected_single_circle');
                this.spinner.hide();
            }
            if (this.selected_single_zone) {
                if (this.all_data.Zone) {
                    this.SelectedZones = this.all_data.Zone;
                    this.selected_z = this.selected_single_zone;
                    this.spinner.hide();
                } else {
                    this.userUtilsService.getZone().subscribe((data: any) => {
                        this.SelectedZones = data.Zones;
                        this.single_zone = false;
                        this.selected_z = this.selected_single_zone;
                        if (this.selected_single_branch) {
                            this.changeZone(this.selected_single_zone, false, true);
                        } else {
                            this.spinner.hide();
                            localStorage.removeItem('selected_single_zone');
                            localStorage.removeItem('selected_single_branch');
                            localStorage.removeItem('selected_single_circle');
                            this.emitData();
                        }

                    });
                }
            }
        }
        this.emitData();
    }

    changeBranch(changedValue, has_circle = false, has_single_circle = true) {
        this.selected_c = null;
        let changedBranch = null;
        if (changedValue.value)
            changedBranch = {Branch: {BranchCode: changedValue.value}}
        else
            changedBranch = {Branch: {BranchCode: changedValue}}

        if (this.all_data.UserCircleMappings) {
            this.SelectedCircles = this.selected_single_circle;
            this.selected_c = this.SelectedCircles;
            this.spinner.hide();
        } else {
            if (this.SelectedCircles && this.SelectedCircles.length != 0) {
                if (has_single_circle) {
                    this.SelectedCircles.filter(single_circle => {
                        if (single_circle.CircleId == this.selected_single_circle) {
                            this.selected_c = this.selected_single_circle;
                            this.single_circle = true;
                        }
                    });
                }
                localStorage.removeItem('selected_single_zone');
                localStorage.removeItem('selected_single_branch');
                localStorage.removeItem('selected_single_circle');
                this.spinner.hide();
            }


        }
        if (!this.selected_c && this.show_circle) {
            this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {
                this.SelectedCircles = data.Circles;
                this.single_circle = false;

                if (has_single_circle) {
                    this.selected_c = this.selected_single_circle;
                }
                this.spinner.hide();
                localStorage.removeItem('selected_single_zone');
                localStorage.removeItem('selected_single_branch');
                localStorage.removeItem('selected_single_circle');
                this.emitData();


            });
        }
        this.emitData();
    }

    changeZone(changedValue, has_branch = false, has_single_branch = true) {
        this.selected_b = null;
        this.selected_c = null;
        let changedZone = null;
        if (changedValue.value) {
            changedZone = {Zone: {ZoneId: changedValue.value}}
        } else {
            changedZone = {Zone: {ZoneId: changedValue}}
        }

        if (this.all_data.Branch) {
            this.SelectedBranches = this.all_data.Branch;
            this.selected_b = this.SelectedBranches;
            this.spinner.hide();
        } else {
            this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
                this.SelectedBranches = data.Branches;
                this.single_branch = false;
                if (has_single_branch) {


                    this.selected_b = this.selected_single_branch;
                    if (this.selected_single_circle) {
                        this.single_branch = true;
                        this.changeBranch(this.selected_b, false, true)
                    } else {
                        this.spinner.hide();
                        localStorage.removeItem('selected_single_zone');
                        localStorage.removeItem('selected_single_branch');
                        localStorage.removeItem('selected_single_circle');
                        this.emitData();

                    }
                }
            });
        }

        this.emitData();

    }

    private addFormControls() {
        let localStorageData = JSON.parse(localStorage.getItem('ZTBLUser'));

        if (this.required_branch && localStorageData.Branch) {
            this.form.addControl('BranchCode', new FormControl(null, Validators.required))
        } else {
            this.form.addControl('BranchCode', new FormControl(null))
        }

        if (this.required_zone && localStorageData.Zone)
            this.form.addControl('ZoneId', new FormControl(null, Validators.required))
        else
            this.form.addControl('ZoneId', new FormControl(null))

        if (this.show_circle) {
            this.form.addControl('CircleId', new FormControl(null))
        }
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
        if (this.SelectedCircles?.length > 1)
            final_circle = this.SelectedCircles?.filter((circ) => circ.Id == this.selected_c)[0]
        else if (this.SelectedCircles?.length == 1)
            final_circle = this.SelectedCircles[0];
        else
            final_circle = this.SelectedCircles;

        /*if(final_zone != null){
            final_zone.ZoneId = final_zone.ZoneId.toString()
        }
        if(final_branch != null){
            final_branch.BranchId = final_branch.BranchId.toString()
        }*/


        this.branchZoneCircleData.emit({
            final_zone: Array.isArray(final_zone) ? final_zone[0] : final_zone,
            final_branch: final_branch,
            final_circle: final_circle
        });
    }

    changeCircle(event) {
        this.emitData();
    }

    clearForm() {

        Object.keys(this.form.controls).forEach((key) => {
            if (key != 'BranchCode' && key != 'ZoneId' && key != 'WorkingDate')
                this.form.get(key).reset();
        });
        this.emitData();
    }
}

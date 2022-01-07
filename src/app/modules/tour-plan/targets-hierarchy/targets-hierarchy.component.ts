import {Component, OnInit} from '@angular/core';
import {TourPlanService} from "../Service/tour-plan.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-targets-hierarchy',
    templateUrl: './targets-hierarchy.component.html',
    styleUrls: ['./targets-hierarchy.component.scss']
})
export class TargetsHierarchyComponent implements OnInit {


    targets: any;

    constructor(private targetsService: TourPlanService, private spinner: NgxSpinnerService, private toastr: ToastrService) {
    }

    ngOnInit(): void {
        this.getTargetsHeirarchy();
    }

    private getTargetsHeirarchy() {
        this.spinner.show();
        this.targetsService.getTargetsHeirarchy().subscribe((data) => {
            this.spinner.hide();
            if (data.Success) {
                this.targets = data.Target.Targets;
            }
        })
    }

    updateTarget(single_target: any) {
        this.spinner.show();
        this.targetsService.updateTargetsHierarchy(single_target).subscribe((data) => {
            this.spinner.hide();
            if (data.Success) {
                this.toastr.success(data.Message);
            } else {
                this.toastr.error(data.Message);

            }
        })
    }
}

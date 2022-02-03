import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {SignaturePadForTourComponent} from "../signature-pad-for-tour/signature-pad-for-tour.component";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {finalize} from "rxjs/operators";
import {TourPlanService} from "../Service/tour-plan.service";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-tour-approval-tab',
    templateUrl: './tour-approval-tab.component.html',
    styleUrls: ['./tour-approval-tab.component.scss']
})
export class TourApprovalTabComponent implements OnInit {
    @Input('TourPlans') TourPlans: any;
    @Input('tourPlanApprovalForm') tourPlanApprovalForm: any;
    @Input('branch') branch: any;
    @Input('zone') zone: any;
    @Input('circle') circle: any;
    dataSource = new MatTableDataSource();
    itemsPerPage = 10;
    private OffSet: number;
    pageIndex: any;
    dv: number | any; //use later
    children: [any][any] = [];
    totalItems: number
    Math: any;


    constructor(
        private layoutUtilsService: LayoutUtilsService,
        public dialog: MatDialog,
        private toaster: ToastrService,
        private tourPlanService: TourPlanService,
        private spinner: NgxSpinnerService) {
    }

    ngOnInit(): void {
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {

        this.itemsPerPage = pageSize;
        this.OffSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        // this.searchTourPlanApproval()
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }

    getBranchName(branchId) {
        if (branchId == this.branch?.BranchId)
            return this.branch.Name
    }

    getZoneName(zoneId) {
        if (zoneId == this.zone?.ZoneId)
            return this.zone.ZoneName

        console.log(this.zone)
    }

    change(parent, status, index, child) {
        let parent_index = this.children.indexOf(parent);
        let ids = []
        this.children[parent_index]?.children?.forEach((single_children) => {
            ids.push(String(single_children.TourPlanId));
        })

        if (ids.length == 0) {
            var Message = 'Please select Record From List';
            this.layoutUtilsService.alertElement(
                '',
                Message,
                null
            );
            return;
        }

        this.changeStatus(this.children[parent_index], status, index);
    }


    changeCheckBox(parent, child: any) {
        let parent_index = this.children.indexOf(parent);
        if (!this.children[parent_index].children.includes(child.TourPlanId)) {
            this.children[parent_index].children.push(child.TourPlanId)
        } else {
            this.children[parent_index].children.pop(child.TourPlanId);
        }
    }

    changeStatus(child: any, status: string, index) {
        if (child) {
            let signatureDialogRef = this.dialog.open(
                SignaturePadForTourComponent,
                {
                    minHeight: '200px',
                    width: '850px',
                    disableClose: true,
                    data: {userId: child.UserId, ids: child.children, status: status}
                },
            );
            signatureDialogRef.afterClosed().subscribe(() => {
                    this.searchTourPlanApproval(false, child.UserId, index);
                }
            )
        } else {
            this.toaster.error("No Child Found");
        }

    }


    toggleAccordion(i: number, user_id) {
        let icon = document.getElementById('arrow_down_' + i).innerHTML;
        if (icon == 'expand_more') {
            document.getElementById('arrow_down_' + i).innerHTML = 'expand_less';
            document.getElementById('table_' + i).style.display = 'block';
            this.searchTourPlanApproval(false, user_id, i);

        } else {
            document.getElementById('arrow_down_' + i).innerHTML = 'expand_more';
            document.getElementById('table_' + i).style.display = 'none';
        }
        this.children = [];
    }

    searchTourPlanApproval(start = false, user_id = null, index = 0) {
        debugger;
        let offset = '0';
        if (start)
            offset = this.OffSet.toString();
        let _TourPlan = Object.assign(this.tourPlanApprovalForm);
        this.spinner.show();
        this.tourPlanService.searchForTourPlanApproval(_TourPlan, this.itemsPerPage, offset, this.branch, this.zone, this.circle, user_id)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {


                if (baseResponse.Success) {

                    this.TourPlans.TourPlans[index].TourPlans = baseResponse.TourPlanList[0].TourPlans;
                    this.TourPlans.TourPlans[index].children = []
                    this.TourPlans.TourPlans.forEach((single_plan) => {
                        this.children.push(single_plan);
                    })
                    if (this.dataSource) {
                        this.dv = this.dataSource?.data;
                        this.dataSource.data = this.dv?.slice(0, this.totalItems)
                        this.OffSet = this.pageIndex;
                        this.dataSource = this.dv?.slice(0, this.itemsPerPage);
                    }

                } else {

                    if (this.dv != undefined) {
                        this.dataSource = this.dv.slice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
                        this.OffSet = 1;
                        this.pageIndex = 1;
                        this.dv = this.dv.slice(1, 0);
                    }
                    this.layoutUtilsService.alertElement("", baseResponse.Message);

                }
            });
    }

    getStatus(status: string) {

        if (status == 'P') {
            return "Submit";
        } else if (status == 'N') {
            return "Pending";
        } else if (status == 'S') {
            return "Submitted";
        } else if (status == 'A') {
            return "Authorized";
        } else if (status == 'R') {
            return "Refer Back";
        }
    }

    checkBoxCheck(status) {
        if (status == 'S') {
            return true;
        } else {
            return false;
        }

        // else if (status == 'N') {
        //     return "Pending";
        // } else if (status == 'S') {
        //     return "Submitted";
        // } else if (status == 'A') {
        //     return "Authorized";
        // } else if (status == 'R') {
        //     return "Refer Back";
        // }
    }

}

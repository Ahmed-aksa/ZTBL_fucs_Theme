import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {MatDialog} from "@angular/material/dialog";
import {ToastrService} from "ngx-toastr";
import {NgxSpinnerService} from "ngx-spinner";
import {SignaturePadForTourComponent} from "../../tour-plan/signature-pad-for-tour/signature-pad-for-tour.component";
import {finalize} from "rxjs/operators";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {ActivatedRoute, Router} from "@angular/router";
import {EncryptDecryptService} from "../../../shared/services/encrypt_decrypt.service";

@Component({
    selector: 'app-tour-diary-approval-tab',
    templateUrl: './tour-diary-approval-tab.component.html',
    styleUrls: ['./tour-diary-approval-tab.component.scss']
})
export class TourApprovalTabComponent implements OnInit {
    @Input('TourDiary') TourDiary: any;
    @Input('tourDiaryApprovalForm') tourDiaryApprovalForm: any;
    @Input('branch') branch: any;
    @Input('zone') zone: any;
    @Input('circle') circle: any;
    @Input('tab_number') tab_number: any;

    dataSource = new MatTableDataSource();
    itemsPerPage = 10;
    pageIndex: any;
    dv: number | any; //use later
    children: [any][any] = [];
    totalItems: number
    Math: any;
    private OffSet: number;

    constructor(
        private layoutUtilsService: LayoutUtilsService,
        public dialog: MatDialog,
        private toaster: ToastrService,
        private tourDiaryService: TourDiaryService,
        private spinner: NgxSpinnerService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private enc: EncryptDecryptService ) {
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


    toggleAccordion(i: number, user_id, tour_date) {
        let icon = document.getElementById('arrow_down_' + i).innerHTML;
        if (icon == 'expand_more') {
            document.getElementById('arrow_down_' + i).innerHTML = 'expand_less';
            document.getElementById('table_' + i).style.display = 'block';
            this.searchTourPlanApproval(false, user_id, i, tour_date);

        } else {
            document.getElementById('arrow_down_' + i).innerHTML = 'expand_more';
            document.getElementById('table_' + i).style.display = 'none';
        }
        this.children = [];
    }

    searchTourPlanApproval(start = false, user_id = null, index = 0, tour_date = null) {

        let offset = '0';
        if (start)
            offset = this.OffSet.toString();
        let _TourPlan = Object.assign(this.tourDiaryApprovalForm);
        this.spinner.show();
        this.tourDiaryService.searchTourDiaryApproval(_TourPlan, this.itemsPerPage, offset, this.branch, this.zone, this.circle, user_id, tour_date)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {


                if (baseResponse.Success) {

                    this.TourDiary.TourDiaries[index].TourDiary = baseResponse.TourDiary.TourDiaries[this.tab_number]?.TourDiaries;
                    this.TourDiary.TourDiaries[index].children = []
                    this.TourDiary.TourDiaries.forEach((single_plan) => {
                        this.children.push(single_plan);
                    })
                    if (this.dataSource) {
                        this.dv = this.dataSource?.data;
                        this.dataSource.data = this.dv?.slice(0, this.totalItems)
                        this.OffSet = this.pageIndex;
                        this.dataSource = this.dv?.slice(0, this.itemsPerPage);
                    }

                } else {
                    this.TourDiary.TourDiary[index].TourDiary = [];
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

    CheckDirectionStatus(loanUtilization: any) {
        // this.loggedInUserDetails.User.UserId;
        // if (this.isMCO) {
        //     if (loanUtilization.Status == 'P' || loanUtilization.Status == 'R') {
        //         if (loanUtilization.CreatedBy == this.loggedInUserDetails.User.UserId) {
        //             return true;
        //         } else {
        //             return false;
        //         }
        //     } else {
        //         return false;
        //     }
        // } else if (this.isBM) {
        //     if (loanUtilization.Status == 'S') {
        //         return true;
        //     }
        // } else {
        //     return false;
        // }
        return true

    }

    redirectTourDiary(data: any) {

        if (data?.RedirectTo) {
            localStorage.setItem('selected_single_zone',this.enc.encryptStorageData(  JSON.stringify(this.zone.ZoneId)));
            if (this.branch)
                localStorage.setItem('selected_single_branch',this.enc.encryptStorageData(  JSON.stringify(this.branch?.BranchCode)));
            localStorage.removeItem('TourDiary')
            localStorage.setItem('TourDiary',this.enc.encryptStorageData(  JSON.stringify(data)));
            this.router.navigate([data?.RedirectTo], {
                relativeTo: this.activatedRoute
            });
        }
    }

    dateChange(date: string) {
        var day = date.slice(0, 2),
            month = date.slice(2, 4),
            year = date.slice(4, 8);
        return day + "-" + month + "-" + year;
    }

}


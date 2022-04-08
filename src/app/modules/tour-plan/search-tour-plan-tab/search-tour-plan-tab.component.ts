import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {Activity} from "../../../shared/models/activity.model";
import {EncryptDecryptService} from "../../../shared/services/encrypt_decrypt.service";

@Component({
    selector: 'app-search-tour-plan-tab',
    templateUrl: './search-tour-plan-tab.component.html',
    styleUrls: ['./search-tour-plan-tab.component.scss']
})
export class SearchTourPlanTabComponent implements OnInit {
    @Input('TourPlan') TourPlan: any;
    @Input('tourDiaryApprovalForm') tourDiaryApprovalForm: any;
    @Input('branch') branch: any;
    @Input('zone') zone: any;
    @Input('circle') circle: any;
    @Input('tab_number') tab_number: any;

    itemsPerPage: number;
    OffSet: number;
    pageIndex: string;
    dataSource = new MatTableDataSource();
    dv: number | any; //use later
    currentActivity: Activity;

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private userUtilsService: UserUtilsService,
                private enc: EncryptDecryptService) {
    }

    ngOnInit(): void {
        this.currentActivity = this.userUtilsService.getActivity('Search Tour Diary')
    }

    toggleAccordion(i: number) {
        let down_arrow = document.getElementById('arrow_down_' + i).style.display;
        if (down_arrow == 'block') {
            document.getElementById('arrow_down_' + i).style.display = 'none';
            document.getElementById('arrow_up_' + i).style.display = 'block';
            document.getElementById('table_' + i).style.display = 'block';
        } else {
            document.getElementById('arrow_up_' + i).style.display = 'none';
            document.getElementById('arrow_down_' + i).style.display = 'block';
            document.getElementById('table_' + i).style.display = 'none';

        }
    }

    dateChange(date: string) {
        var day = date?.slice(0, 2),
            month = date?.slice(2, 4),
            year = date?.slice(4, 8);
        return day + "-" + month + "-" + year;
    }

    redirectTourPlan(data: any, mode) {

        if (data?.RedirectTo) {

            if (this.zone.ZoneId)
                localStorage.setItem('selected_single_zone',this.enc.encryptStorageData( JSON.stringify(this.zone.ZoneId)));
            if (this.branch?.BranchCode)
                localStorage.setItem('selected_single_branch',this.enc.encryptStorageData( JSON.stringify(this.branch?.BranchCode)));
            if (data?.CircleId)
                localStorage.setItem('selected_single_circle',this.enc.encryptStorageData( JSON.stringify((data?.CircleId)?.toString())));
            var tourDiary = JSON.stringify(data)
            localStorage.setItem('SearchTourPlan',this.enc.encryptStorageData( tourDiary));
            localStorage.setItem('EditViewTourPlan', this.enc.encryptStorageData('1'));
            if (mode == 'V') {
                localStorage.setItem('visibility',this.enc.encryptStorageData( 'true'));
            } else {
                if (mode == 'E') {
                    localStorage.setItem('visibility',this.enc.encryptStorageData( 'false'));
                }
            }
            // this.router.navigate([data?.RedirectTo], {
            //     relativeTo: this.activatedRoute
            // });
            this.router.navigate([data?.RedirectTo, {upFlag: "1"}], {relativeTo: this.activatedRoute});
        }
    }

    CheckDirectionStatus(model: any) {
        if (model.Status == 'P') {
            return true;
        } else if (model.Status == 'R') {
            return true;
        }
        return false;
    }

    // paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
    //     this.itemsPerPage = pageSize;
    //     this.OffSet = (pageIndex - 1) * this.itemsPerPage;
    //     this.pageIndex = pageIndex;
    //     this.SearchTourPlan()
    //     this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    // }

}

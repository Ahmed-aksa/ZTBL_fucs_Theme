import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {Activity} from "../../../shared/models/activity.model";

@Component({
    selector: 'app-search-tour-diary-tab',
    templateUrl: './search-tour-diary-tab.component.html',
    styleUrls: ['./search-tour-diary-tab.component.scss']
})
export class SearchTourDiaryTabComponent implements OnInit {
    @Input('TourDiary') TourDiary: any;
    @Input('tourDiaryApprovalForm') tourDiaryApprovalForm: any;
    @Input('form') searchForm: any;
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

    constructor(private router: Router, private activatedRoute: ActivatedRoute, private userUtilsService: UserUtilsService) {
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

    redirectTourDiary(data: any, mode) {
        debugger;
        if (data?.RedirectTo) {

            if (this.zone.ZoneId)
                localStorage.setItem('selected_single_zone', JSON.stringify(this.zone.ZoneId));
            if (this.branch?.BranchCode)
                localStorage.setItem('selected_single_branch', JSON.stringify(this.branch?.BranchCode));
            if (data?.CircleId)
                localStorage.setItem('selected_single_circle', JSON.stringify((data?.CircleId)?.toString()));
            var tourDiary = JSON.stringify(data)
            localStorage.setItem('TourDiary', tourDiary)
            if (mode == 'V') {
                localStorage.setItem('visibility', 'true');
            } else {
                if (mode == 'E') {
                    localStorage.setItem('visibility', 'false');
                }
            }
            sessionStorage.setItem('search-page', JSON.stringify(this.searchForm.value));
            this.router.navigate([data?.RedirectTo], {
                relativeTo: this.activatedRoute
            });
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

}

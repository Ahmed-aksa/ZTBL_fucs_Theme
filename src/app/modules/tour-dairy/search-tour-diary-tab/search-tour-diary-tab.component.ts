import {Component, Input, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
    selector: 'app-search-tour-diary-tab',
    templateUrl: './search-tour-diary-tab.component.html',
    styleUrls: ['./search-tour-diary-tab.component.scss']
})
export class SearchTourDiaryTabComponent implements OnInit {
    @Input('TourDiary') TourDiary: any;
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
    constructor(private router: Router, private activatedRoute: ActivatedRoute) {
    }

    ngOnInit(): void {
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

    redirectTourDiary(data: any) {
        if (data?.RedirectTo) {
            localStorage.setItem('selected_single_zone', JSON.stringify(this.zone.ZoneId));
            if (this.branch)
                localStorage.setItem('selected_single_branch', JSON.stringify(this.branch?.BranchCode));
            if (this.circle)
                localStorage.setItem('selected_single_circle', JSON.stringify(this.circle?.CircleId));
            localStorage.removeItem('TourDiary')
            localStorage.setItem('TourDiary', JSON.stringify(data));
            this.router.navigate([data?.RedirectTo], {
                relativeTo: this.activatedRoute
            });
        }
    }

    CheckDirectionStatus(model: any) {
        if(model.Status=='P'){
            return true;
        }
        return false;
    }

}

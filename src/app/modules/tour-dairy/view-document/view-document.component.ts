import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {TourDiaryService} from "../set-target/Services/tour-diary.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";

@Component({
    selector: 'app-view-document',
    templateUrl: './view-document.component.html',
    styleUrls: ['./view-document.component.scss']
})
export class ViewDocumentComponent implements OnInit {
    query: string = '';

    constructor(private route: ActivatedRoute, private router: Router, private tourDiaryService: TourDiaryService, private layoutUtilsService: LayoutUtilsService) {
    }

    ngOnInit(): void {

        this.route.queryParams.subscribe((param) => {
            if (param) {
                this.query = param.query;
                this.getDiaryDocumentData();
            }
        })
    }

    getDiaryDocumentData() {
        this.tourDiaryService.getTourDiaryDetailForDocument(this.query).subscribe((data: any) => {
            if (data.Success) {
                localStorage.setItem('selected_single_zone', JSON.stringify(data.TourDiary?.TourDiaries[0]?.ZoneId));
                localStorage.setItem('selected_single_branch', JSON.stringify(data.TourDiary?.TourDiaries[0]?.BranchCode));
                localStorage.setItem('selected_single_circle', JSON.stringify((data.TourDiary?.TourDiaries[0]?.CircleId)?.toString()));
                localStorage.setItem('TourDiary', JSON.stringify(data.TourDiary))
                localStorage.setItem('visibility', 'true');
                let url = data?.TourDiary.TourDiaries[0].RedirectTo
                this.router.navigate([url]);
            } else {
                this.layoutUtilsService.alertMessage("", data.Message);
                this.router.navigate(['dashboard']);
            }
        })
    }

}

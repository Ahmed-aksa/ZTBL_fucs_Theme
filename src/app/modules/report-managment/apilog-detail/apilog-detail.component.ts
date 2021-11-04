import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {finalize} from 'rxjs/operators';
import {MatTableDataSource} from "@angular/material/table";
import {ReportFilters} from "../models/report-filters.model";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ReportService} from "../services/report.service";
import {Store} from "@ngrx/store";
import {AppState} from "../../../shared/reducers";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {RequestResponse} from 'app/shared/models/request_response.model';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-apilog-detail',
    templateUrl: './apilog-detail.component.html',
    styleUrls: ['./apilog-detail.component.scss']
})
export class ApilogDetailComponent implements OnInit {


    dataSource = new MatTableDataSource();
    reportFilter: ReportFilters = new ReportFilters();
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;
    Request: string;
    Response: string;
    RequestResponse: RequestResponse = new RequestResponse();
    displayedColumns = ['Request', 'Response'];

    gridHeight: string;

    constructor(public dialogRef: MatDialogRef<ApilogDetailComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private store: Store<AppState>,
                public dialog: MatDialog,
                public snackBar: MatSnackBar,
                private layoutUtilsService: LayoutUtilsService,
                private _reportservice: ReportService,
                private spinner: NgxSpinnerService
    ) {
    }


    ngOnInit() {

        this.getAPIRequestResponse();
    }


    ngAfterViewInit() {
        this.gridHeight = window.innerHeight - 400 + 'px';
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    loadApiLogsPage() {
        this.getAPIRequestResponse();
    }


    getAPIRequestResponse() {


        this.reportFilter.clear();
        this.reportFilter.Id = this.data.reportFilter.Id;

        this.spinner.show();
        if (!this.data.is_third) {

            this._reportservice.getAPIRequestResponse(this.reportFilter)
                .pipe(
                    finalize(() => {
                        this.spinner.hide();
                    })
                )
                .subscribe((baseResponse: any) => {

                    if (baseResponse.Success) {

                        this.RequestResponse = baseResponse.ActivityLog;
                    } else
                        this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

                });
        } else {
            this._reportservice.getThirdPartyRequestResponse(this.reportFilter)
                .pipe(
                    finalize(() => {
                        this.spinner.hide();
                    })
                )
                .subscribe((baseResponse: any) => {

                    if (baseResponse.Success) {

                        this.RequestResponse = baseResponse._3RdPartyAPILog;
                    } else
                        this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

                });
        }
    }


    filterConfiguration(): any {
        const filter: any = {};
        const searchText: string = this.searchInput.nativeElement.value;
        filter.title = searchText;
        return filter;
    }


}


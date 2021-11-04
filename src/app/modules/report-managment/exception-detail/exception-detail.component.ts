import {Component, ElementRef, Inject, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {Store} from "@ngrx/store";
import {MatPaginator} from "@angular/material/paginator";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {ReportService} from "../services/report.service";
import {ReportFilters} from "../models/report-filters.model";
import {finalize} from "rxjs/operators";
import {AppState} from "../../../shared/reducers";
import {MatSnackBar} from "@angular/material/snack-bar";
import {ErrorLogDetails} from '../models/error_log.model';
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";

@Component({
    selector: 'app-exception-detail',
    templateUrl: './exception-detail.component.html',
    styleUrls: ['./exception-detail.component.scss']
})
export class ExceptionDetailComponent implements OnInit {


    dataSource = new MatTableDataSource();
    reportFilter: ReportFilters = new ReportFilters();
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;
    Request: string;
    Response: string;
    errorLogDetails: ErrorLogDetails = new ErrorLogDetails();
    displayedColumns = ['InputParameters', 'ErrorTrace', 'Message'];

    gridHeight: string;


    constructor(public dialogRef: MatDialogRef<ExceptionDetailComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private store: Store<AppState>,
                public dialog: MatDialog,
                public snackBar: MatSnackBar,
                private layoutUtilsService: LayoutUtilsService,
                //private excelService: ExcelUtilsService,
                //private auditService: AuditTrailService,
                private _reportservice: ReportService) {
    }

    ngOnInit() {

        this.getErrorLogDetails();
    }


    ngAfterViewInit() {
        this.gridHeight = window.innerHeight - 400 + 'px';
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    LoadErrorLogDetailsPage() {
        this.getErrorLogDetails();
    }


    getErrorLogDetails() {


        this.reportFilter.clear();
        this.reportFilter.Id = this.data.reportFilter.Id;

        this._reportservice.getErrorLogDetails(this.reportFilter)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.errorLogDetails = baseResponse.ErrorLog;
                } else
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

            });
    }


    exportToExcel() {
        //this.exportActivities = [];
        //Object.assign(this.tempExportActivities, this.dataSource.data);
        //this.tempExportActivities.forEach((o, i) => {
        //  this.exportActivities.push({
        //    activityName: o.activityName,
        //    activityURL: o.activityURL,
        //    parentActivityName: o.parentActivityName
        //  });
        //});
        //this.excelService.exportAsExcelFile(this.exportActivities, 'activities');
    }

    filterConfiguration(): any {
        const filter: any = {};
        const searchText: string = this.searchInput.nativeElement.value;
        filter.title = searchText;
        return filter;
    }


    ngOnDestroy() {
        //this.subscriptions.forEach(el => el.unsubscribe());
    }


    //isAllSelected(): boolean {
    //  //const numSelected = this.selection.selected.length;
    //  //const numRows = this.cashrequestsResult.length;
    //  //return numSelected === numRows;
    //}

    /**
     * Toggle selection
     */
    masterToggle() {
        //if (this.selection.selected.length === this.cashrequestsResult.length) {
        //  this.selection.clear();
        //} else {
        //  this.cashrequestsResult.forEach(row => this.selection.select(row));
        //}
    }
}

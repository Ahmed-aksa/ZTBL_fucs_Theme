import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApilogDetailComponent} from "../apilog-detail/apilog-detail.component";
import {Store} from "@ngrx/store";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {finalize} from "rxjs/operators";
import {AppState} from "../../../shared/reducers";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {ReportService} from "../services/report.service";
import {ReportFilters} from "../models/report-filters.model";

@Component({
    selector: 'app-apilogs-list',
    templateUrl: './apilogs-list.component.html',
    styleUrls: ['./apilogs-list.component.scss']
})
export class ApilogsListComponent implements OnInit {

    dataSource = new MatTableDataSource();
    reportFilter: ReportFilters = new ReportFilters();
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean = true;

    displayedColumns = ['Id', 'TransactionId', 'ApiName', 'CallDateTime', 'ResponseDateTime', 'View'];
    public _apiNameWidth = "350px";
    public _dateWidth = "200px";
    public _IdWidth = "100px";
    gridHeight: string;
    gridmargintop: string;
    FilterForm: FormGroup;
    StartDate: Date;
    EndDate: Date;
    myDate = new Date().toLocaleDateString();

    constructor(
        //private datePipe: DatePipe,
        private store: Store<AppState>,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private filterFB: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private _reportservice: ReportService
    ) {

    }

    ngOnInit() {
        this.createForm();
        this.loadApiLogs();

    }


    ngAfterViewInit() {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 400 + 'px';
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    loadApiLogsPage() {
        this.loadApiLogs();
    }


    createForm() {
        this.StartDate = new Date();
        this.FilterForm = this.filterFB.group({
            StartDate: [new Date(), [Validators.required]],
            EndDate: [new Date(), [Validators.required]]
        });
    }


    hasError(controlName: string, errorName: string): boolean {
        return this.FilterForm.controls[controlName].hasError(errorName);
    }


    comparisonEnddateValidator(): any {
        let ldStartDate = this.FilterForm.value['StartDate'];
        let ldEndDate = this.FilterForm.value['EndDate'];

        let startnew = new Date(ldStartDate);
        let endnew = new Date(ldEndDate);
        if (startnew > endnew) {
            return this.FilterForm.controls['EndDate'].setErrors({'invaliddaterange': true});
        }

        let oldvalue = startnew;
        this.FilterForm.controls['StartDate'].reset();
        this.FilterForm.controls['StartDate'].patchValue(oldvalue);
        return this.FilterForm.controls['StartDate'].setErrors({'invaliddaterange': false});
    }

    comparisonStartdateValidator(): any {
        let ldStartDate = this.FilterForm.value['StartDate'];
        let ldEndDate = this.FilterForm.value['EndDate'];

        let startnew = new Date(ldStartDate);
        let endnew = new Date(ldEndDate);
        if (startnew > endnew) {
            return this.FilterForm.controls['StartDate'].setErrors({'invaliddaterange': true});
        }

        let oldvalue = endnew;
        this.FilterForm.controls['EndDate'].reset();
        this.FilterForm.controls['EndDate'].patchValue(oldvalue);
        return this.FilterForm.controls['EndDate'].setErrors({'invaliddaterange': false});
    }


    loadApiLogs() {

        this.reportFilter = Object.assign(this.reportFilter, this.FilterForm.value);

        this._reportservice.getAllAPILogs(this.reportFilter)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success)
                    this.dataSource.data = baseResponse._3RdPartyAPILogs;
                else
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


    viewRequestResponse(reportFilter: ReportFilters) {
        var width = (window.innerWidth - 170) + 'px';
        //var height = (window.innerHeight - 140) + 'px';

        const dialogRef = this.dialog.open(ApilogDetailComponent, { /*height: height,*/
            width: width,
            data: {reportFilter: reportFilter},
            disableClose: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }

            this.loadApiLogsPage();
        });
    }

}

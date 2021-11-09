import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ApilogDetailComponent} from "../apilog-detail/apilog-detail.component";
import {Store} from "@ngrx/store";
import {MatPaginator, PageEvent} from "@angular/material/paginator";
import {MatSort, Sort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {finalize, map} from "rxjs/operators";
import {AppState} from "../../../shared/reducers";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {ReportService} from "../services/report.service";
import {ReportFilters} from "../models/report-filters.model";
import {NgxSpinnerService} from "ngx-spinner";
import {Observable, of} from "rxjs";
import {fromMatPaginator, fromMatSort, paginateRows, sortRows} from './datasource-utils';

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
    third_party_apis: any;
    third_party_apis_details: any;
    loading: boolean = true;
    panelOpenState: boolean = true;

    displayedRows$: Observable<any[]>;
    totalRows$: Observable<number>;
    displayedColumns = ['Id', 'TransactionId', 'ApiName', 'CallDateTime', 'ResponseDateTime', 'ResponseTotalTime', 'View'];
    gridHeight: string;
    FilterForm: FormGroup;
    StartDate: Date;
    EndDate: Date;
    myDate = new Date().toLocaleDateString();
    rows: any
    private sortEvents$: Observable<Sort>;
    private pageEvents$: Observable<PageEvent>;

    constructor(
        private store: Store<AppState>,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private filterFB: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private _reportservice: ReportService,
        private spinner: NgxSpinnerService
    ) {

    }

    ngOnInit() {

        this.createForm();
        this.loadApiLogs();


    }


    ngAfterViewInit() {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 500 + 'px';
    }


    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
        const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
        const rows$ = of(this.dataSource.filteredData);
        this.totalRows$ = rows$.pipe(map(rows => rows.length));
        this.displayedRows$ = rows$.pipe(sortRows(sortEvents$), paginateRows(pageEvents$));

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

        this.reportFilter = Object.assign(this.reportFilter, this.FilterForm.value, this.panelOpenState = false);
        this.spinner.show();
        this._reportservice.getAllAPILogs(this.reportFilter)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: any) => {
                if (baseResponse.Success) {
                    this.dataSource = new MatTableDataSource(baseResponse.ActivityLogs);
                    this.sortEvents$ = fromMatSort(this.sort);
                    this.pageEvents$ = fromMatPaginator(this.paginator);
                    this.dataSource.data = baseResponse.ActivityLogs;
                    this.rows = of(this.dataSource.data);

                    this.totalRows$ = this.rows.pipe(map((rows: any) => rows.length));
                    this.displayedRows$ = this.rows.pipe(sortRows(this.sortEvents$), paginateRows(this.pageEvents$));
                } else
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

            });
    }

    filterConfiguration(): any {
        const filter: any = {};
        const searchText: string = this.searchInput.nativeElement.value;
        filter.title = searchText;
        return filter;
    }

    viewRequestResponse(event: any, reportFilter: ReportFilters, is_third = false) {
        var width = (window.innerWidth - 130) + 'px';
        //var height = (window.innerHeight - 140) + 'px';

        const dialogRef = this.dialog.open(ApilogDetailComponent, { /*height: height,*/
            panelClass: ['w-8/12'],
            height: '500px',
            data: {reportFilter: reportFilter, is_third: is_third},
            disableClose: false
        });
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }

            this.loadApiLogsPage();
        });
    }

    fetch3rdAPI(event: Event, item: any) {
        item.TranId = Number(item.Id);
        item.Id = Number(item.Id);
        this._reportservice.getThirdPartyAPILogs(item).subscribe((data: any) => {
            if (data._3RdPartyAPILogs.length != 0) {
                item.third_apis = data._3RdPartyAPILogs;
            } else {
                this.third_party_apis = null;
            }
        })
    }

    toggleAccordion(event: Event, item) {
        event.stopPropagation();
        event.stopImmediatePropagation();
        item.TranId = Number(item.Id);
        item.Id = Number(item.Id);
        this._reportservice.getThirdPartyApiDetails(item).subscribe((data: any) => {
            if (data._3RdPartyAPILog.length != 0) {
                this.third_party_apis_details = data._3RdPartyAPILog;
            } else {
                this.third_party_apis_details = null;
            }
        })
    }
}

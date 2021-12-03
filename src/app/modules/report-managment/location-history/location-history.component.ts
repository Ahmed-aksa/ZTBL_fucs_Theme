import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {ReportFilters} from '../models/report-filters.model';
import {MatDialog} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ReportService} from "../services/report.service";
import {Store} from "@ngrx/store";
import {finalize} from "rxjs/operators";
import {AppState} from "../../../shared/reducers";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {ViewMapsComponent} from "../../../shared/component/view-map/view-map.component";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
    selector: 'app-location-history',
    templateUrl: './location-history.component.html',
    styleUrls: ['./location-history.component.scss']
})
export class LocationHistoryListComponent implements OnInit {

    dataSource = new MatTableDataSource();
    reportFilter: ReportFilters = new ReportFilters();
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;

    displayedColumns = ['UserId', 'Created', 'LastAction', 'AppChannel', 'Remarks', 'Location'];

    gridHeight: string;
    FilterForm: FormGroup;
    StartDate: Date;
    hasFormErrors = false;
    EndDate: Date;


    constructor(
        private store: Store<AppState>,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private filterFB: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private _reportservice: ReportService) {
    }

    ngOnInit() {

        this.createForm();
    }

    createForm() {
        this.FilterForm = this.filterFB.group({
            StartDate: [new Date()],
            EndDate: [new Date()],
            PPNumber: [this.reportFilter.PPNumber, [Validators.required]]
        });
    }


    ngAfterViewInit() {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 200 + 'px';
    }


    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }


    loadUserHistoryPage() {
        this.dataSource.data = [];
        this.loadUserHistory();
    }


    keyPress(event: any) {

        const pattern = /[0-9\+\-\ ]/;

        let inputChar = String.fromCharCode(event.charCode);
        if (event.keyCode != 8 && !pattern.test(inputChar)) {
            event.preventDefault();
        }
    }


    hasError(controlName: string, errorName: string): boolean {
        return this.FilterForm.controls[controlName].hasError(errorName);
    }


    get f(): any {
        return this.FilterForm.controls;
    }


    loadUserHistory() {


        this.hasFormErrors = false;
        this.reportFilter = Object.assign(this.reportFilter, this.FilterForm.value);
        this.spinner.show();
        if (this.reportFilter.PPNumber == null || this.reportFilter.PPNumber.toString() == "") {
            const controls = this.FilterForm.controls;

            if (this.FilterForm.invalid) {
                Object.keys(controls).forEach(controlName =>
                    controls[controlName].markAsTouched()
                );

                this.hasFormErrors = true;
                return;
            }
        } else {
            this._reportservice.getUserHistory(this.reportFilter)
                .pipe(
                    finalize(() => {
                        this.loading = false;
                    })
                )
                .subscribe(baseResponse => {
                    this.spinner.hide();

                    if (baseResponse.Success)
                        this.dataSource.data = baseResponse.UserHistories;
                    else
                        this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

                });

        }
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


    exportToExcel() {

    }

    filterConfiguration(): any {
        const filter: any = {};
        const searchText: string = this.searchInput.nativeElement.value;
        filter.title = searchText;
        return filter;
    }

    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    ngOnDestroy() {

    }


    masterToggle() {

    }

    showLocation(history) {
        let data = {
            Lat: history.Latitude,
            Lng: history.Longitude
        };
        const dialogRef = this.dialog.open(ViewMapsComponent, {
            panelClass: ['h-screen', 'max-w-full', 'max-h-full'],
            width: '100%',
            data: data,
            disableClose: true
        });
    }
}

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {Store} from "@ngrx/store";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {MatSort} from "@angular/material/sort";
import {MatDialog} from "@angular/material/dialog";
import {ReportService} from "../services/report.service";
import {ReportFilters} from "../models/report-filters.model";
import {finalize} from "rxjs/operators";
import {AppState} from "../../../shared/reducers";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";

@Component({
  selector: 'app-ecib-queue',
  templateUrl: './ecib-queue.component.html',
  styleUrls: ['./ecib-queue.component.scss']
})

export class EcibQueueComponent implements OnInit {

    dataSource = new MatTableDataSource();
    reportFilter: ReportFilters = new ReportFilters();
    @ViewChild('searchInput', { static: true }) searchInput: ElementRef;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort: MatSort;
    loading: boolean;

    displayedColumns = [ 'TransactionId', 'CREATED', 'CNIC', 'STATUS', 'NTN', 'NAME', 'PERMANENTADDRESS', 'BRANCH', 'DOB'];

    gridHeight: string;
    FilterForm: FormGroup;
    StartDate: Date;
    EndDate: Date;
    myDate = new Date().toLocaleDateString();
    constructor( //private datePipe: DatePipe,
        private store: Store<AppState>,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private filterFB: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private _reportservice: ReportService

    ) { }

    ngOnInit() {
        this.loadApiLogs();
    }


    ngAfterViewInit() {
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 300 + 'px';
    }



    applyFilter(filterValue: string) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    loadApiLogsPage() {
        this.loadApiLogs();
    }

    loadApiLogs() {
        this._reportservice.getEcibQeue()
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe(baseResponse => {
                if (baseResponse.Success)
                    this.dataSource.data = baseResponse.ecibListFull;
                else
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

            });
    }

}

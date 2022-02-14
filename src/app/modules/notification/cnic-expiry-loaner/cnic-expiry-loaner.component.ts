import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Lov} from "../../../shared/classes/lov.class";
import {NgxSpinnerService} from "ngx-spinner";
import {LovService} from "../../../shared/services/lov.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {finalize, map} from "rxjs/operators";
import {NotificationService} from "../service/notification.service";
import {Observable, of} from "rxjs";
import {MatSort, Sort} from "@angular/material/sort";
import {fromMatSort, sortRows} from "../../report-managment/apilogs-list/datasource-utils";
import {Store} from "@ngrx/store";
import {AppState} from "../../../shared/reducers";
import {FormBuilder, FormGroup} from "@angular/forms";

@Component({
  selector: 'app-cnic-expiry-loaner',
  templateUrl: './cnic-expiry-loaner.component.html',
  styleUrls: ['./cnic-expiry-loaner.component.scss']
})

export class CnicExpiryLoanerComponent implements OnInit, AfterViewInit {
    displayedColumns = ['cnic', 'customer' ,'father', 'address', 'dob','cnicexp'];
    loaded = true;
    matTableLenght = false;
    loading = false;

    notificationTable: FormGroup;
    itemsPerPage = 10;
    pageIndex = 1;
    totalItems: number | any;
    dv: number | any; //use later
    gridHeight: string;

    dataSource: MatTableDataSource<any>;
    displayedRows$: Observable<any[]>;
    totalRows$: Observable<number>;
    rows: any

    LoggedInUserInfo: BaseResponseModel;
    @ViewChild(MatSort) sort: MatSort;

    statusLov: any;
    public LovCall = new Lov();


    constructor(
        private store: Store<AppState>,
        private _notification: NotificationService,
        private spinner: NgxSpinnerService,
        private _lovService: LovService,
        private fb: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
    ) {
    }

    ngOnInit(): void {
        this.createForm();
        this.find()
    }

    createForm(){
        this.notificationTable = this.fb.group({
            Name:[],
            Cnic:[]
        })
    }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue.trim().toLowerCase();
        const sortEvents$: Observable<Sort> = fromMatSort(this.sort);
        // const pageEvents$: Observable<PageEvent> = fromMatPaginator(this.paginator);
        const rows$ = of(this.dataSource.filteredData);
        this.totalRows$ = rows$.pipe(map(rows => rows.length));
        this.displayedRows$ = rows$.pipe(sortRows(sortEvents$));
    }


    find() {
        let t = 7;
        this.spinner.show();
        this._notification.notificationCards(t)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.dataSource = new MatTableDataSource<any>(baseResponse.Customers)
                    this.dv = this.dataSource;
                    this.matTableLenght = true

                    this.rows = of(this.dataSource.data);

                    this.totalRows$ = this.rows.pipe(map((rows: any) => rows.length));
                    //this.displayedRows$ = this.rows.pipe(sortRows(this.sortEvents$), paginateRows(this.pageEvents$));

                } else {

                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    this.matTableLenght = false;
                    this.dataSource = null;
                    //this.offSet = 0;
                    this.pageIndex = 1;

                }
            })
    }


    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.pageIndex = pageIndex;
        //this.OffSet = pageIndex;

        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
    }


    ngAfterViewInit() {

        this.gridHeight = window.innerHeight - 200 + 'px';
    }


}

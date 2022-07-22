// Angular
import {Component, OnInit, ViewChild} from '@angular/core';
// Material
// RXJS
import {finalize, map} from 'rxjs/operators';
// NGRX
import {Store} from '@ngrx/store';
import {ConfigurationHistoryComponent} from '../configuration-history/configuration-history.component';
import {MatTableDataSource} from "@angular/material/table";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AppState} from "../../../shared/reducers";
import {LayoutUtilsService, MessageType} from "../../../shared/services/layout_utils.service";
import {Configuration} from "../models/configuration.model";
import {ConfigurationEditComponent} from "../configuration-edit/configuration-edit.component";
import {ConfigurationService} from "../service/configuration.service";
import {DocumentTypeModel} from "../models/document_type.model";
import {Activity} from "../../../shared/models/activity.model";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {NgxSpinnerService} from "ngx-spinner";
import {RefreshLovService} from "../service/refreshLov.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {LovService} from "../../../shared/services/lov.service";
import {Observable, of} from "rxjs";
import {MatSort, Sort} from "@angular/material/sort";
import {fromMatSort, sortRows} from "../../report-managment/apilogs-list/datasource-utils";
import {MatPaginator} from "@angular/material/paginator";

// Services

@Component({
    selector: 'app-refresh-lov',
    templateUrl: './refresh-lov.component.html',
    styleUrls: ['./refresh-lov.component.scss']
})
export class RefreshLovComponent implements OnInit {

    @ViewChild(MatPaginator, {static: false}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: false}) sort: MatSort;

    dataSource: MatTableDataSource<any>
    displayedColumns = ['KeyId', 'KeyValue', 'KeyName'];
    configurations: any;
    // Selection
    gridHeight: string;
    loading: boolean = false;
    lists_record;
    currentActivity: Activity;
    Response;
    LovList;
    public Lovs;
    public LovPagination = new LovsByPage();

    constructor(
        private store: Store<AppState>,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private _lovService: LovService,
        private userUtilsService: UserUtilsService,
        private layoutUtilsService: LayoutUtilsService,
        private RefreshLovService: RefreshLovService,
        private spinner: NgxSpinnerService,
    ) {
    }

    ngOnInit() {
        this.getLovs()
    }

    applyFilter(event: Event) {
        const filterValue = (event.target as HTMLInputElement).value;
        this.dataSource.filter = filterValue.trim().toLowerCase();
    }

    async getLovs() {
        this.spinner.show();
        this.LovPagination = {PageBit: 0, EndIndex: 0, StartIndex: 0}
        this.Response = await this._lovService.GetLovsByPage(this.Lovs = {LovPagination: this.LovPagination});
        this.lists_record = this.Response.LOVs;
        for(let i=0; i<this.Response.LovPaginations.length; i++){
            this.LovList = await this._lovService.GetLovsByPage(this.Lovs = {LovPagination: this.Response.LovPaginations[i]});
            this.lists_record.push(...this.LovList.LOVs)
        }
        this.spinner.hide();
        this.getTable()
    }

    getTable(){
        this.loading=true;

        this.loading = false;
        this.dataSource = new MatTableDataSource<any>(this.lists_record);
        // this.dataSource.filterPredicate = (data:any, filter: string): boolean=> {
        //     //see that "data" here is the value of the "row"
        //     return (data.TagName.includes(filter));
        // };
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
    }

    Refresh() {
        this.spinner.show()
        this.RefreshLovService.refreshLov()
            .pipe(
                finalize(() => {
                    this.spinner.hide()

                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {
                this.layoutUtilsService.alertElementSuccess(
                    '',
                    baseResponse.Message,
                    baseResponse.Code = null
                );
            } else {
                this.layoutUtilsService.alertElement(
                    '',
                    baseResponse.Message,
                    baseResponse.Code = null
                );
            }

        });
    }
}

export class LovsByPage {
    public PageBit: number;
    public StartIndex: number;
    public EndIndex: number;

}

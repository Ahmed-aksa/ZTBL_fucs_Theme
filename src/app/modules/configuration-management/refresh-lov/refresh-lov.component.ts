// Angular
import {Component, OnInit} from '@angular/core';
// Material
// RXJS
import {finalize} from 'rxjs/operators';
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

// Services

@Component({
    selector: 'app-refresh-lov',
    templateUrl: './refresh-lov.component.html',
    styleUrls: ['./refresh-lov.component.scss']
})
export class RefreshLovComponent implements OnInit {

    dataSource = new MatTableDataSource();
    displayedColumns = ['KeyName', 'KeyValue', 'actions', 'history'];
    configurations: any;
    // Selection
    gridHeight: string;
    loading: boolean = false;
    lists_record: any = [];
    currentActivity: Activity;

    constructor(
        private store: Store<AppState>,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private userUtilsService: UserUtilsService,
        private layoutUtilsService: LayoutUtilsService,
        private RefreshLovService: RefreshLovService,
        private spinner: NgxSpinnerService,
    ) {
    }

    ngOnInit() {

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

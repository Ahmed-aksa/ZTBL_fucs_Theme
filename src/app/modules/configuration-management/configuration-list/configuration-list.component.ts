// Angular
import {Component, OnInit, ElementRef, ViewChild, ChangeDetectionStrategy, OnDestroy} from '@angular/core';
// Material
import {SelectionModel} from '@angular/cdk/collections';
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

// Services

@Component({
    selector: 'app-configuration-list',
    templateUrl: './configuration-list.component.html',
    styleUrls: ['./configuration-list.component.scss']
})
export class ConfigurationListComponent implements OnInit {

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
        private _configurationService: ConfigurationService,
    ) {
    }

    ngOnInit() {
        this.loadConfigurationPage();
    }


    loadConfigurationsList() {
        this.loading = true;

        this._configurationService.GetConfigurations()
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success) {
                this.configurations = baseResponse.Configurations;
            } else {
                this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
            }

        });
    }


    loadConfigurationPage() {
        this.loadConfigurationsList();
    }

    DeleteDocumentType(_item: DocumentTypeModel) {
        const _title = 'Document-Type';
        const _description = 'Are you sure to permanently delete this Document-Type?';
        const _waitDesciption = 'Document-Type is deleting...';
        const _deleteMessage = `Document-Type has been deleted`;

        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }


            this._configurationService.DeleteConfiguration(this.configurations).pipe(
                finalize(() => {

                })
            ).subscribe((x) => {
                this.layoutUtilsService.showActionNotification(_deleteMessage, MessageType.Delete);
                this.loadConfigurationsList();
                console.log('output');
                console.log(x);
            });

        });
    }

    addNewConfiguration() {
        const newConfiguration = new Configuration();
        newConfiguration.clear(); // Set all defaults fields
        this.editConfiguration(newConfiguration);
    }

    editConfiguration(configuration: Configuration) {
        const _saveMessage = configuration.KeyID ? 'New Document-Type successfully has been added.' : 'Document-Type successfully has been updated.';
        const _messageType = configuration.KeyID ? MessageType.Update : MessageType.Create;
        const dialogRef = this.dialog.open(ConfigurationEditComponent, {
            data: {configuration: configuration},
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {

            if (!res) {
                return;
            } else {
                this.loadConfigurationsList();

            }
        });
    }

    historyConfiguration() {
        this.dialog.open(ConfigurationHistoryComponent);
    }

    toggleAccordion(i: string) {
        if (!this.lists_record.includes(i)) {
            this.lists_record.push(i)
            document.getElementById('table_' + i).style.display = 'block';
        } else {
            this.lists_record.pop(i);
            document.getElementById('table_' + i).style.display = 'none';
        }
    }
}

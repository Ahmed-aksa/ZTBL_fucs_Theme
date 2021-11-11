import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import {AppState} from "../../../shared/reducers";
import {Store} from "@ngrx/store";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LayoutUtilsService, MessageType} from "../../../shared/services/layout-utils.service";
import {finalize} from "rxjs/operators";
import {DocumentTypeModel} from "../models/document_type.model";
import {DocumentTypeService} from "../service/document-type.service";
import {DocumentTypeEditComponent} from "../document-type-edit/document-type-edit.component";

@Component({
    selector: 'app-document-type-list',
    templateUrl: './document-type-list.component.html',
    styleUrls: ['./document-type-list.component.scss']
})
export class DocumentTypeListComponent implements OnInit {

    // Table fields
    dataSource = new MatTableDataSource();
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;
    displayedColumns = ['Name', 'NoOfPages', 'actions'];

    // Selection

    gridHeight: string;
    public documentType = new DocumentTypeModel();

    constructor(
        private store: Store<AppState>,
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private layoutUtilsService: LayoutUtilsService,
        //private excelService: ExcelUtilsService,
        //private auditService: AuditTrailService,
        private _documentTypeService: DocumentTypeService) {
    }

    ngOnInit() {
        this.loadDocumentTypePage();
    }

    loadDocumentTypeList() {
        this.loading = true;

        this._documentTypeService.GetDocumentTypes()
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success)
                this.dataSource.data = baseResponse.DocumentTypes;
            else
                this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

        });
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


    loadDocumentTypePage() {
        this.loadDocumentTypeList();
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

    DeleteDocumentType(_item: DocumentTypeModel) {
        const _title = 'Document-Type';
        const _description = 'Are you sure you want to delete selected Documt-Type ?';
        const _waitDesciption = 'Document-Type is deleting...';
        const _deleteMessage = `Document-Type has been deleted`;

        const dialogRef = this.layoutUtilsService.deleteElement(_title, _description, _waitDesciption);
        dialogRef.afterClosed().subscribe(res => {
            if (!res) {
                return;
            }

            this.documentType = new DocumentTypeModel();
            this.documentType.Id = _item.Id;
            ;

            this._documentTypeService.DeleteDocumentType(this.documentType).pipe(
                finalize(() => {

                })
            ).subscribe(baseResponse => {
                if (baseResponse.Success) {
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                    this.loadDocumentTypePage();
                } else
                    this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

            });
        });
    }


    addDocumentType() {
        const newDocumentType = new DocumentTypeModel();
        newDocumentType.clear(); // Set all defaults fields
        this.editDocuemtnType(newDocumentType);
    }

    editDocuemtnType(docuemtnType: DocumentTypeModel) {


        const _saveMessage = docuemtnType.Id ? 'New Document-Type successfully has been added.' : 'Document-Type successfully has been updated.';
        const _messageType = docuemtnType.Id ? MessageType.Update : MessageType.Create;
        const dialogRef = this.dialog.open(DocumentTypeEditComponent, {
            panelClass: ['w-6/12'],
            data: {docuemtnType: docuemtnType},
            disableClose: true
        });
        dialogRef.afterClosed().subscribe(res => {

            if (!res) {
                return;
            }

            this.loadDocumentTypeList();
        });
    }
}

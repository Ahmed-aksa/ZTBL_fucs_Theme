import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogModule,MatDialog} from "@angular/material/dialog";
import {MatSortModule, MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";

import {NdcRequestsService} from '../services/ndc-requests.service';
import {finalize} from 'rxjs/operators';
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";

@Component({
  selector: 'app-search-ndc-list',
  templateUrl: './search-ndc-list.component.html',
  styleUrls: ['./search-ndc-list.component.scss']
})
export class SearchNdcListComponent implements OnInit {

    request_data_source = new MatTableDataSource();
    pending_requests_data_source = new MatTableDataSource();
    dataSource = new MatTableDataSource();
    displayedColumns = ['EmployeeNo', 'EmployeeName', 'PhoneNumber', 'Email', 'ZoneName', 'BranchName', 'UserCircles', 'actions'];
    ndc_requests_displayed_columns = ['serialNumber', 'customer_cnic', 'name', 'current_status', 'last_status', 'next_action_by', 'request_by', 'request_on', 'actions'];
    pending_ndc_requests_displayed_columns = ['customer_cnic', 'customer_name', 'request_on'];
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;
    gridHeight: string;

    constructor(
        public dialog: MatDialog,
        private ndc_request_service: NdcRequestsService,
        private layoutUtilsService: LayoutUtilsService) {
    }


  ngOnInit(): void {
      this.loadUsersList();
  }

    applyFilter(filterValue: string) {
        this.dataSource.filter = filterValue;
    }

    loadUsersList(cnic = '') {
        this.loading = true;
        this.ndc_request_service.getRequests(cnic)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((baseResponse: any) => {
                if (baseResponse.Success) {
                    this.request_data_source = baseResponse.Ndc.Ndcrequests;
                    if (baseResponse.Ndc.pendingNdcs != null) {
                        this.pending_requests_data_source = baseResponse.Ndc.pendingNdcs;
                    }
                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }

            });
    }

    ngAfterViewInit() {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 330 + 'px';
    }

    findCnic(cnic: HTMLInputElement) {
        this.loadUsersList(cnic.value);
    }
    downloadFile(customer_cnic,customer_id) {
        this.ndc_request_service.downloadFile(customer_cnic,customer_id)
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            )
            .subscribe((baseResponse: any) => {
                if (baseResponse.Success) {
                    window.open(window.URL.createObjectURL(baseResponse.Ndc.ndcFilePath));
                }
            });
    }

}

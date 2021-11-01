/* eslint-disable max-len */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no- */
/* eslint-disable prefer-const */
/* eslint-disable eol-last */
/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */
import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialogModule, MatDialog} from "@angular/material/dialog";
import {MatSortModule, MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {finalize} from 'rxjs/operators';
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NdcRequestsService} from "../Services/ndc-requests.service";
import { BaseResponseModel } from 'app/shared/models/base_response.model';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { UserUtilsService } from 'app/shared/services/users_utils.service';
import {HttpClient} from "@angular/common/http";
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
    ndc_requests_displayed_columns = ['Id', 'customer_cnic', 'name', 'current_status', 'last_status', 'next_action_by', 'request_by', 'request_on', 'actions'];
    pending_ndc_requests_displayed_columns = ['customer_cnic', 'customer_name', 'request_on'];
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;
    gridHeight: string;
    selected_b;

    hide = true;
    selected_z;
    selected_c;
    LoggedInUserInfo:BaseResponseModel;

    ndcForm: FormGroup;

    pageSize = 10;
    ndcLength : number;
    pendingLength : number;
    pageSizeOptions = [10, 25, 50]
    offSet = 0;
    count = 1;
    user : any = {};

    pageIndex = 1;
    pageIndexPending = 1;

    dvReq : any;
    dvPending : any;

    Zones: any = [];
    Branches: any = [];
    Circles: any = [];

    SelectedZone : any = [];
    SelectedBranch : any = [];
    SelectedCircle : any = [];
    Math: any;

    SrNo: number | any;

    constructor(
      public dialog: MatDialog,
      private ndc_request_service: NdcRequestsService,
      private layoutUtilsService: LayoutUtilsService,
      private fb: FormBuilder,
      private spinner: NgxSpinnerService,
      private userUtilsService: UserUtilsService,private http: HttpClient) {
        this.Math = Math;
    }



    ngOnInit() {
      this.LoggedInUserInfo = this.userUtilsService.getUserDetails();
      this.createForm()


      if (this.LoggedInUserInfo.Branch.BranchCode != "All") {
        this.Circles = this.LoggedInUserInfo.UserCircleMappings;
        this.SelectedCircle = this.Circles;

        this.Branches = this.LoggedInUserInfo.Branch;
        this.SelectedBranch = this.Branches;

        this.Zones = this.LoggedInUserInfo.Zone;
        this.SelectedZone = this.Zones;

        this.selected_z = this.SelectedZone.ZoneId
        this.selected_b = this.SelectedBranch.BranchCode
        this.selected_c = this.SelectedCircle.Id
        console.log(this.SelectedZone)
        this.ndcForm.controls["ZoneId"].setValue(this.SelectedZone.ZoneName);
        this.ndcForm.controls["BranchCode"].setValue(this.SelectedBranch.Name);
      }

      this.loadUsersList();
    }

    createForm(){
      this.ndcForm = this.fb.group({
        ZoneId: [null],
        BranchCode: [null],
        CircleId: [null],
        Cnic: [null]
      })
    }

    applyFilter(filterValue: string) {
      this.dataSource.filter = filterValue;
    }

    // getAllNDC(){
    //   this.loadUsersList()
    // }

    loadUsersList() {

      this.user.ZoneId = this.ndcForm.controls.ZoneId.value;
      this.user.BranchCode = this.ndcForm.controls.BranchCode.value;
      this.user.CircleId = this.ndcForm.controls.CircleId.value;
      this.user.Cnic = this.ndcForm.controls.Cnic.value;

      if(this.user.ZoneId != this.SelectedZone.ZoneId && this.user.BranchCode != this.SelectedBranch.BranchCode){
        this.user.ZoneId = this.selected_z;
        this.user.BranchCode = this.selected_b;
      }
      this.spinner.show();
      this.loading = true;
      this.ndc_request_service.getRequests(this.user, this.pageSize, this.offSet)
        .pipe(
          finalize(() => {
            this.loading = false;
            this.spinner.hide();
          })
        )
        .subscribe((baseResponse: any) => {
          if (baseResponse.Success) {

            console.log(baseResponse)
            this.request_data_source = baseResponse.Ndc.Ndcrequests;
            this.dvReq = this.request_data_source;
            this.ndcLength = this.dvReq.length;
            this.request_data_source = this.dvReq.slice(0, this.pageSize);

            if (baseResponse.Ndc.pendingNdcs != null) {
              this.pending_requests_data_source = baseResponse.Ndc.pendingNdcs;
              this.dvPending = this.pending_requests_data_source;
              this.pendingLength = this.dvPending.length;
              this.pending_requests_data_source = this.dvPending.slice(0, this.pageSize);
              // this.pending_requests_data_source.paginator = this.paginator;
              // this.pendingLength = baseResponse.Ndc.pendingNdcs.length;
            }
          } else {
            this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
          }

        });
    }

    DeleteUser(request: any){
        this.user.NDCId = request.NDCId;
        this.user.CircleId = request.CircleId;
        this.user.Remarks = request.MCORemarks;

        // this.user.BranchCode = this.ndcForm.controls.BranchCode.value

        this.ndc_request_service.DeleteCustomer(this.user).pipe( finalize(() =>{
                this.loading = false;
                this.spinner.hide();
        })
        ).subscribe((baseResponse: any) => {
            if(baseResponse.Success){
                this.layoutUtilsService.alertElementSuccess('', baseResponse.Message);
                window.location.reload();
            }
        })

    }


    ngAfterViewInit() {

      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.gridHeight = window.innerHeight - 330 + 'px';
    }

    // findCnic(cnic: HTMLInputElement) {
    //   this.loadUsersList(cnic.value);
    // }

    findCnic() {
      this.loadUsersList();
    }

    downloadFile(customer_cnic,customer_id) {
      this.spinner.show();
      this.ndc_request_service.downloadFile(customer_cnic,customer_id, this.pageSize, this.offSet = 0, this.user)
        .pipe(
          finalize(() => {
            this.spinner.hide();
            this.loading = false;
          })
        )
        .subscribe((baseResponse: any) => {
          if (baseResponse.Success) {

            this.layoutUtilsService.alertElementSuccess('', baseResponse.Message)
            window.open(baseResponse.Ndc.ndcFilePath,'Download');
            this.downloadFile1()


          }
        });
    }
    downloadFile1(): any {
        alert("dsds")
        return this.http.get('http://172.16.1.228/ZtblDocument/NDC_Request/TempReport_011121020540.pdf', {responseType: 'blob'});
    }
    Num:any;
    paginateRequest(pageIndex: any, pageSize: any = this.pageSize) {
        if(pageSize)
        for(var i=0;i>pageSize;i++)
        {
            this.Num.push(i++)
        }
      this.pageSize = pageSize;
      this.pageIndex = pageIndex;
      this.offSet = pageIndex;

      this.request_data_source = this.dvReq.slice(pageIndex * this.pageSize - this.pageSize, pageIndex * this.pageSize); //slice is used to get limited amount of data from APi
    }

    paginatePending(pageIndex: any, pageSize: any = this.pageSize) {
      this.pageIndexPending = pageSize;
      this.pageIndexPending = pageIndex;
      this.offSet = pageIndex;

      this.pending_requests_data_source = this.dvPending.slice(pageIndex * this.pageSize - this.pageSize, pageIndex * this.pageSize); //slice is used to get limited amount of data from APi
    }

    submitDeleteStatus(request) {
      //debugger
        if (request.Status == 'Submitted' || request.Status == 'Pending for approval' || request.Status == 'ReferBack') {
            return true
        }
        else {
            return false
        }
    }
    submitSubmitStatus(request) {
        if (request.Status == 'Submitted' || request.Status == 'ReferBack') {
            return true
        }
        else {
            return false
        }
    }

    SubmitUser(request) {
        this.user.NDCId = request.NDCId;
        this.user.CircleId = request.CircleId;
        this.user.Remarks = request.MCORemarks;

        // this.user.BranchCode = this.ndcForm.controls.BranchCode.value

        this.ndc_request_service.SubmitUser(this.user).pipe( finalize(() =>{
                this.loading = false;
                this.spinner.hide();
            })
        ).subscribe((baseResponse: any) => {
            if(baseResponse.Success){
                this.layoutUtilsService.alertElementSuccess('', baseResponse.Message);
                window.location.reload();
            }
        })
    }

    refresh() {
        this.createForm()
        this.loadUsersList()
    }
}

/* eslint-disable arrow-parens */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable max-len */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable no-debugger */
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
import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {MatSort} from "@angular/material/sort";
import {MatPaginator} from "@angular/material/paginator";
import {MatTableDataSource} from "@angular/material/table";
import {finalize} from 'rxjs/operators';
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {NdcRequestsService} from "../Services/ndc-requests.service";
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {FormBuilder, FormGroup} from '@angular/forms';
import {NgxSpinnerService} from 'ngx-spinner';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {HttpClient} from "@angular/common/http";
import {CircleService} from "../../../shared/services/circle.service";

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
    ndc_requests_displayed_columns = [
        'Id',
        'customer_cnic', 'name', 'current_status', 'last_status', 'next_action_by', 'request_by', 'request_on', 'actions'];
    pending_ndc_requests_displayed_columns = ['customer_cnic', 'customer_name', 'request_on'];
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;
    gridHeight: string;
    selected_b;
    hasSrNo: boolean = false;
    hide = true;
    selected_z;
    selected_c;
    LoggedInUserInfo: BaseResponseModel;

    ndcForm: FormGroup;

    pageSize = 10;
    pageSizePending = 10;
    ndcLength: number;
    pendingLength: number;
    pageSizeOptions = [10, 25, 50]
    offSet = 0;
    count = 1;
    user: any = {};
    single_zone = true;

    pageIndex = 1;
    pageIndexPending = 1;

    dvReq: any;
    dvPending: any;
    disable_zone = true;
    disable_branch = true;

    Zones: any = [];
    Branches: any = [];
    Circles: any = [];

    SelectedZones: any = [];
    SelectedBranch: any = [];
    SelectedCircles: any = [];
    Math: any;
    public Zone = new Zone();

    SrNo: number | any;
    SelectedBranches: any = [];
    single_branch = true;
    disable_circle = true;
    private _cdf: ChangeDetectorRef
    isUserAdmin: boolean = false;
    private loggedInUserDetails: any;
    private final_branch: any;
    private final_zone: any;

    constructor(
        public dialog: MatDialog,
        private ndc_request_service: NdcRequestsService,
        private layoutUtilsService: LayoutUtilsService,
        private fb: FormBuilder,
        private _circleService: CircleService,
        private spinner: NgxSpinnerService,
        private userUtilsService: UserUtilsService, private http: HttpClient) {
        this.Math = Math;
    }



    ngOnInit() {
        this.createForm()
        this.settingZBC()
        this.loadUsersList();
        this.LoggedInUserInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        if(this.hasSrNo != true){
            this.ndc_requests_displayed_columns = [
                'customer_cnic', 'name', 'current_status', 'last_status', 'next_action_by', 'request_by', 'request_on', 'actions'];
        }
        //
        // if (this.LoggedInUserInfo.User.App == "1") {
        //     //admin user
        //     this.isUserAdmin = true;
        //     this.GetZones();
        // }

        // if (this.LoggedInUserInfo.Branch.BranchCode != "All") {
        //   this.Circles = this.LoggedInUserInfo.UserCircleMappings;
        //   this.SelectedCircles = this.Circles;
        //
        //   this.Branches = this.LoggedInUserInfo.Branch;
        //   this.SelectedBranches = this.Branches;
        //
        //   this.Zones = this.LoggedInUserInfo.Zone;
        //   this.SelectedZones = this.Zones;
        //
        //   this.selected_z = this.SelectedZones.ZoneId
        //   this.selected_b = this.SelectedBranches.BranchCode
        //   this.selected_c = this.SelectedCircles.Id
        //   console.log(this.SelectedZones)
        //   this.ndcForm.controls["ZoneId"].setValue(this.SelectedZones.ZoneName);
        //   this.ndcForm.controls["BranchCode"].setValue(this.SelectedBranches.Name);
        // }

    }

    createForm(){
      this.ndcForm = this.fb.group({
        ZoneId: [null],
        BranchId: [null],
        CircleId: [null],
        Cnic: [null]
      })
    }
    refreshForm(){
        this.ndcForm = this.fb.group({
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
        this.user.BranchId = this.ndcForm.controls.BranchId.value;
        this.user.CircleId = this.ndcForm.controls.CircleId.value;
        this.user.Cnic = this.ndcForm.controls.Cnic.value;

        if (this.user.ZoneId != this.SelectedZones.ZoneId && this.user.BranchCode != this.SelectedBranches.BranchCode) {
            this.user.ZoneId = this.selected_z;
            this.user.BranchId = this.selected_b;
        }

        this.assignBranchAndZone();

        this.spinner.show();
        this.loading = true;
        this.ndc_request_service.getRequests(this.user, this.pageSize, this.offSet,this.final_zone,this.final_branch)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: any) => {
                if (baseResponse.Success) {

                    console.log(baseResponse)
                    this.request_data_source = baseResponse.Ndc.Ndcrequests
                    if(this.request_data_source[0].srNo != undefined){
                        this.hasSrNo = true;
                    }
                    this.dvReq = this.request_data_source;
                    this.ndcLength = this.dvReq.length;
                    this.request_data_source = this.dvReq.slice(0, this.pageSize);

                    if (baseResponse.Ndc.pendingNdcs != null) {
                        this.pending_requests_data_source = baseResponse.Ndc.pendingNdcs;
              this.dvPending = this.pending_requests_data_source;
              this.pendingLength = this.dvPending.length;
              this.pending_requests_data_source = this.dvPending.slice(0, this.pageSizePending);
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

        this.ndc_request_service.DeleteCustomer(this.user).pipe(finalize(() => {
                this.loading = false;
                this.spinner.hide();
            })
        ).subscribe((baseResponse: any) => {
            if (baseResponse.Success) {
                this.layoutUtilsService.alertElementSuccess('', baseResponse.Message);
                window.location.reload();
            }
        })

    }

    GetZones() {

        this.loading = true;
        this._circleService.getZones()
            .pipe(
                finalize(() => {
                    this.loading = false;
                })
            ).subscribe(baseResponse => {

            if (baseResponse.Success) {

                baseResponse.Zones.forEach(function (value) {
                    value.ZoneName = value.ZoneName.split("-")[1];
                })
                this.Zones = baseResponse.Zones;
                this.SelectedZones = baseResponse.Zones;

                //this.landSearch.controls['ZoneId'].setValue(this.Zones[0].ZoneId);
                //this.GetBranches(this.Zones[0].ZoneId);
                this.loading = false;
                this._cdf.detectChanges();
            } else
                this.layoutUtilsService.alertElement("", baseResponse.Message);

        });
    }
    private assignBranchAndZone() {


        //Branch
        if (this.SelectedBranches.length) {
            this.final_branch = this.SelectedBranches?.filter((circ) => circ.BranchCode == this.selected_b)[0];
            this.loggedInUserDetails.Branch = this.final_branch;
        } else {
            this.final_branch = this.SelectedBranches;
            this.loggedInUserDetails.Branch = this.final_branch;
        }
        //Zone
        if (this.SelectedZones.length) {
            this.final_zone = this.SelectedZones?.filter((circ) => circ.ZoneId == this.selected_z)[0]
            this.loggedInUserDetails.Zone = this.final_zone;
        } else {
            this.final_zone = this.SelectedZones;
            this.loggedInUserDetails.Zone = this.final_zone;
        }

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
            //this.downloadFile1()
          }
          else{
              this.layoutUtilsService.alertElement('', baseResponse.Message)
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
        for(var i=1;i>=pageSize;i++)
        {
            this.Num.push(i++)
        }
      this.pageSize = pageSize;
      this.pageIndex = pageIndex;
      this.offSet = pageIndex;

      this.request_data_source = this.dvReq.slice(pageIndex * this.pageSize - this.pageSize, pageIndex * this.pageSize); //slice is used to get limited amount of data from APi
    }

    paginatePending(pageIndex: any, pageSize: any = this.pageSizePending) {
      this.pageSizePending = pageSize;
      this.pageIndexPending = pageIndex;
      this.offSet = pageIndex;

      this.pending_requests_data_source = this.dvPending.slice(pageIndex * this.pageSizePending - this.pageSizePending, pageIndex * this.pageSizePending); //slice is used to get limited amount of data from APi
    }

    submitDeleteStatus(request) {
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
        } else {
            return false
        }
    }

    changeZone(changedValue) {
        let changedZone = {Zone: {ZoneId: changedValue.value}}
        this.userUtilsService.getBranch(changedZone).subscribe((data: any) => {
            this.Branches = data.Branches;
            this.SelectedBranches = this.Branches;
            this.single_branch = false;
            this.disable_branch = false;
        });
    }

    changeBranch(changedValue) {
        let changedBranch = null;
        if (changedValue.value)
            changedBranch = {Branch: {BranchCode: changedValue.value}}
        else
            changedBranch = {Branch: {BranchCode: changedValue}}

        this.userUtilsService.getCircle(changedBranch).subscribe((data: any) => {

            this.Circles = data.Circles;
            this.SelectedCircles = this.Circles;
            this.disable_circle = false;
            if (changedValue.value) {
                // this.getBorrower();
            }
        });
    }

    SubmitUser(request) {
        this.user.NDCId = request.NDCId;
        this.user.CircleId = request.CircleId;
        this.user.Remarks = request.MCORemarks;

        // this.user.BranchCode = this.ndcForm.controls.BranchCode.value

        this.ndc_request_service.SubmitUser(this.user).pipe(finalize(() => {
                this.loading = false;
                this.spinner.hide();
            })
        ).subscribe((baseResponse: any) => {
            if (baseResponse.Success) {
                this.layoutUtilsService.alertElementSuccess('', baseResponse.Message);
                window.location.reload();
            }
        })
    }

    refresh() {

        this.ndcForm.controls["Cnic"].setValue("");
        this.loadUsersList()
    }

    settingZBC() {
         debugger
        this.loggedInUserDetails = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        if (this.loggedInUserDetails.Branch && this.loggedInUserDetails.Branch.BranchCode != "All") {
            this.SelectedCircles = this.loggedInUserDetails.UserCircleMappings;

            this.SelectedBranches = this.loggedInUserDetails.Branch;
            this.SelectedZones = this.loggedInUserDetails.Zone;

            this.selected_z = this.SelectedZones?.ZoneId
            this.selected_b = this.SelectedBranches?.BranchCode
            this.selected_c = this.SelectedCircles?.Id
            this.ndcForm.controls.ZoneId.setValue(this.SelectedZones.ZoneName);
            this.ndcForm.controls.BranchId.setValue(this.SelectedBranches.BranchCode);

        } else if (!this.loggedInUserDetails.Branch && !this.loggedInUserDetails.Zone && !this.loggedInUserDetails.Zone) {
            this.spinner.show();
            this.userUtilsService.getZone().subscribe((data: any) => {
                this.Zone = data?.Zones;
                this.SelectedZones = this?.Zone;
                this.single_zone = false;
                this.disable_zone = false;
                this.spinner.hide();
            });
        }
    }


}

export class Zone {
    ZoneId: number;
    ZoneName: string;


}

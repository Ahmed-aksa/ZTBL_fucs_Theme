/* eslint-disable prefer-const */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup} from '@angular/forms';
import {LayoutUtilsService} from '../../shared/services/layout-utils.service';
import {MatTableDataSource} from '@angular/material/table';
import {BorrowerInformationService} from './service/borrower-information.service';
import {CircleService} from '../../shared/services/circle.service';
import {BaseResponseModel} from '../../shared/models/base_response.model';
import {UserUtilsService} from '../../shared/services/users_utils.service';
import { environment } from 'environments/environment';

@Component({
    selector: 'kt-borrower-information',
    templateUrl: './borrower-information.component.html',
    styleUrls: ['./borrower-information.component.scss'],
})
export class BorrowerInformationComponent implements OnInit {
    final_circle_ids: String = '';
    displayedColumns = [
        'BranchName',
        'CircleCode',
        'CustomerName',
        'FatherName',
        'Cnic',
        'PhoneNumber',
        'InterestRate',
        'PermanentAddress',
    ];

    branch: any;
    zone: any;
    circle: any;

    matTableLenght: boolean = false;
    PPNOVisible: boolean = true;
    borrowerForm: FormGroup;

    dv;
    itemsPerPage = 10;
    totalItems;
    pageIndex = 1;
    OffSet: number = 0;
    loaded = false;
    user: any = {};

    LoggedInUserInfo: BaseResponseModel;

    dataSource: MatTableDataSource<Borrowers>;


    constructor(
        private _borrowerInfo: BorrowerInformationService,
        private layoutUtilsService: LayoutUtilsService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private fb: FormBuilder,
        private cdRef: ChangeDetectorRef,
        private userUtilsService: UserUtilsService,
        private _circleService: CircleService
    ) {
    }

    ngOnInit() {
        this.createForm();
        this.settingPPNoFeild();
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }


    settingPPNoFeild() {
        console.log('called PPNOVisible');
        var userInfo = this.userUtilsService.getUserDetails();

        // console.log(userInfo);
        //MCO User
        if (userInfo.User.userGroup[0].ProfileID == environment.MCO_Group_ID) {
            this.PPNOVisible = false;
        }
    }

    createForm() {
        var userInfo = this.userUtilsService.getUserDetails();
        this.borrowerForm = this.fb.group({
            Zone: [userInfo?.Zone?.ZoneName],
            Branch: [userInfo?.Branch?.Name],
            Circle: [null],
            Cnic: [null],
        });
    }

    find() {
        this.OffSet = 0;
        this.itemsPerPage = 10;

        this.getBorrower();
    }

    getBorrower() {
        let cnic = this.borrowerForm.controls.Cnic.value;
        this.user.ZoneId = this.borrowerForm.controls.Zone.value;
        this.user.CircleId = this.borrowerForm.controls.Circle.value;
        this.user.ZoneId = this.borrowerForm.controls.Circle.value;
        this.spinner.show();

        this._borrowerInfo
            .getBorrowerInformation(
                this.itemsPerPage,
                this.OffSet,
                cnic,
                this.user,
                this.zone,
                this.branch,
                this.circle
            )
            .pipe(
                finalize(() => {
                    this.loaded = true;
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.dataSource = baseResponse.BorrowerInfo.Borrowers;
                    this.dv = this.dataSource;
                    this.matTableLenght = true;
                    this.totalItems =
                        baseResponse.BorrowerInfo.Borrowers[0].TotalRecords;
                } else {
                    if (this.dv != undefined) {
                        this.matTableLenght = false;
                        this.dataSource = this.dv.slice(1, 0); //this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);
                        // this.dataSource.data = [];
                        // this._cdf.detectChanges();
                        this.OffSet = 0;
                        this.pageIndex = 1;
                        this.dv = this.dv.slice(1, 0);
                    }
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message
                    );
                }
            });
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.OffSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.getBorrower();
        this.dataSource = this.dv.slice(
            pageIndex * this.itemsPerPage - this.itemsPerPage,
            pageIndex * this.itemsPerPage
        );
    }



    MathCeil(value: any) {
        return Math.ceil(value);
    }
}

interface Borrowers {
    CustomerName: string;
    Name: string;
    PhoneNumber: string;
    Cnic: string;
    FatherName: string;
    PermanentAddress: string;
    InterestRate: string;
    TotalRecords: string;
}

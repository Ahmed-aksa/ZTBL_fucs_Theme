import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {MatTableDataSource} from '@angular/material/table';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {UserUtilsService} from '../../../shared/services/users_utils.service';
import {LayoutUtilsService} from '../../../shared/services/layout_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {DeceasedCustomerService} from '../../../shared/services/deceased-customer.service';
import {ActivatedRoute, Router} from '@angular/router';
import {finalize} from 'rxjs/operators';
import {DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE} from "@angular/material/core";
import {MomentDateAdapter} from "@angular/material-moment-adapter";
import {DateFormats} from "../../../shared/classes/lov.class";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Activity} from "../../../shared/models/activity.model";

@Component({
    selector: 'app-referback-deceased',
    templateUrl: './referback-deceased.component.html',
    styleUrls: ['./referback-deceased.component.scss'],
    providers: [
        {
            provide: DateAdapter,
            useClass: MomentDateAdapter,
            deps: [MAT_DATE_LOCALE],
        },
        {provide: MAT_DATE_FORMATS, useValue: DateFormats},
        {
            provide: MatDialogRef,
            useValue: {},
        },
        {
            provide: MAT_DIALOG_DATA,
            useValue: {},
        },
    ],
})
export class ReferbackDeceasedComponent implements OnInit {
    //displayedColumns = ['customer_name', 'father_name', 'death_date', 'Cnic', 'address', 'per_address', 'status', 'branch_code', 'certificate_verified', 'legal_heir', 'View'];
    displayedColumns = [
        'customer_name',
        'father_name',
        'death_date',
        'Cnic',
        'address',
        'branch_code',
        'certificate_verified',
        'legal_heir',
        'View',
    ];

    dataSource: MatTableDataSource<DeceasedCustomer>;

    referBackForm: FormGroup;
    loggedInUser: any;
    gridHeight: string;
    currentActivity: Activity;

    select: Selection[] = [
        {value: '1', viewValue: 'NO'},
        {value: '2', viewValue: 'Yes'},
    ];
    DeceasedCustomerInf;

    constructor(
        private fb: FormBuilder,
        private userUtilsService: UserUtilsService,
        private cdRef: ChangeDetectorRef,
        private layoutUtilsService: LayoutUtilsService,
        private spinner: NgxSpinnerService,
        private _deceasedCustomer: DeceasedCustomerService,
        private router: Router,
        private activatedRoute: ActivatedRoute
    ) {
    }

    ngOnInit(): void {
        this.currentActivity = this.userUtilsService.getActivity('Referred Back (Deceased)')
        this.createForm();
        var userInfo =
            this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.loggedInUser = userInfo.User;
        this.referBackForm.controls.Zone.setValue(userInfo.Zone.ZoneName);
        this.referBackForm.controls.Branch.setValue(userInfo.Branch.Name);
        this._deceasedCustomer
            .GetListOfRejectedDeceasedPerson()
            .pipe(finalize(() => {
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.dataSource =
                        baseResponse.DeceasedCustomer.DeceasedCustomerInfoList;
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message
                    );
                }
            });
    }

    createForm() {
        this.referBackForm = this.fb.group({
            Zone: ['', Validators.required],
            Branch: ['', Validators.required],
            Cnic: [''],
            DateofDeath: [''],
            NadraNo: [''],
            DetailSourceIncome: [''],
            CustomerName: [''],
            Cn: [''],
            FatherName: [''],
            Remarks: [''],
            verified: [''],
            select: [''],
        });
    }

    find() {
    }

    CheckEditStatus(deceased: any) {
        if (deceased.MakerUserID == this.loggedInUser.UserId) {
            return true;
        } else {
            return false;
        }
    }

    CheckViewStatus(deceased: any) {
        //
        if (deceased.MakerUserID != this.loggedInUser.UserId) {
            return true;
        } else {
            return false;
        }
    }

    viewDeceased(Deceased: any) {
        Deceased.obj = 'o';
        this.router.navigate(
            [
                '../customers',
                {
                    LnTransactionID: Deceased.Cnic,
                    CustomerName: Deceased.CustomerName,
                    ViewObj: Deceased.obj,
                },
            ],
            {relativeTo: this.activatedRoute}
        );
    }

    ngAfterViewInit() {
        this.gridHeight = window.innerHeight - 200 + 'px';
    }

    editDeceased(Deceased: any) {
        this.router.navigate(
            [
                '../customers',
                {
                    LnTransactionID: Deceased.Cnic,
                    CustomerName: Deceased.CustomerName,
                },
            ],
            {relativeTo: this.activatedRoute}
        );
    }
}

export interface Selection {
    value: string;
    viewValue: string;
}

export interface DeceasedCustomer {
    CustomerName: string;
    FatherName: string;
    DeathDate: string;
    Cnic: string;
    Address: string;
    PermanentAddress: string;
    Status: string;
    BranchCode: string;
    IsCertificateVerified: string;
    LegalHeairHasIncome: string;
}

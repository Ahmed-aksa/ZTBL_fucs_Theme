import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {PassBookRec} from 'app/shared/models/passbookcoorect.model';
import {CustomerService} from 'app/shared/services/customer.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {ToastrService} from "ngx-toastr";
import {Activity} from "../../../shared/models/activity.model";

@Component({
    selector: 'kt-correction-passbook',
    templateUrl: './correction-passbook.component.html',
    styleUrls: ['./correction-passbook.component.scss']
})
export class CorrectionPassbookComponent implements OnInit {

    loggedInUser: any;
    cpForm: FormGroup;

    public newValue;
    afterFind: boolean = false;
    searchData: boolean = false;

    passBookList: any = {};
    newPassBook: any = [];
    // PassBookRec;

    zone: any;
    branch: any;
    circle: any;


    PassBookRec: PassBookRec[] = [];

    // Pass:PassBookRec[]=[];
    customerRec: any;
    currentActivity: Activity;
    k;
    inputvalue;

    constructor(private fb: FormBuilder,
                private layoutUtilsService: LayoutUtilsService,
                private spinner: NgxSpinnerService,
                private userUtilsService: UserUtilsService,
                public dialog: MatDialog,
                private _customerService: CustomerService,
                private toaster: ToastrService,
                private router: Router,
    ) {
        this.loggedInUser = userUtilsService.getUserDetails();
    }

    get rowKeys(): string[] {
        if (!this.PassBookRec || !this.PassBookRec.length) {
            return [];
        }
        this.k = Object.keys(this.PassBookRec[0])

        this.k.splice(0, 2);
        return this.k;
    }

    ngOnInit() {
        this.currentActivity = this.userUtilsService.getActivity('Correction of Passbook Number');
        this.createForm()

        //   Object.keys(this.cpForm.controls).forEach((control: string) => {
        //     const typedControl: AbstractControl = this.cpForm.controls['NewPassBookNo'];
        //     this.newPassBook = typedControl;
        //     // should log the form controls value and be typed correctly
        // });
    }

    npb() {
    }

    createForm() {
        this.cpForm = this.fb.group({
            Cnic: [null, Validators.required]
        })
    }

//   onInputChanged(value: string, rowIndex: number, propertyKey: string): void {
//     this.newValue = this.PassBookRec.map((row, index) => {
//       return index !== rowIndex? row: {...row, [propertyKey]: value}
//     })
//
//   }

    find() {

        var cnic = this.cpForm.controls['Cnic'].value;
        if (this.cpForm.invalid) {
            this.toaster.error("Please enter CNIC");
            return;
        }
        this.spinner.show();
        this._customerService.findPassbookCorrection(cnic, this.zone, this.branch)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    this.afterFind = true
                    this.customerRec = baseResponse.Customer

                    if (baseResponse.searchLandData != undefined) {
                        this.PassBookRec = baseResponse.searchLandData;

                        // this.PassBookRec = Object.assign({},pass);
                        this.searchData = true;
                    }

                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }

    onInputChanged(value: string, rowIndex: number, propertyKey: string): void {

        this.newValue = this.PassBookRec.map((row, index) => {
            return index !== rowIndex ? row : {...row, [propertyKey]: value};
        });
        this.PassBookRec = Object.assign(this.newValue);
    }

    submit() {

        var cnic = this.cpForm.controls.Cnic.value;
        //var NewPassbookNO = this.cpForm.controls.NewPassBookNo.value;
        //var npb ={NewPassbookNO: NewPassbookNO}
        for (let i = 0; i < this.PassBookRec.length; i++) {
            // this.passBookList.LandInfoID = this.PassBookRec[i].LandInfoID
            // this.passBookList.TotalArea = this.PassBookRec[i].TotalArea
            // this.passBookList.PassbookNO = this.PassBookRec[i].PassbookNO
            // this.passBookList.NewPassbookNO = this.cpForm.controls.NewPassBookNo.value
        }


        //this.passBookList.push(this.PassBookRec)
        //this.passBookList.NewPassbookNO = this.cpForm.controls.NewPassBookN.value;

        this.spinner.show();
        this._customerService.changePassbook(cnic, this.PassBookRec)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {

                if (baseResponse.Success === true) {
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);


                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })

    }

    getAllData(data) {
        this.zone = data.final_zone;
        this.branch = data.final_branch;
        this.circle = null;
    }

}

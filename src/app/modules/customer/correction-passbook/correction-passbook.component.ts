import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialog} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {PassBookRec} from 'app/shared/models/passbookcoorect.model';
import {CustomerService} from 'app/shared/services/customer.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';

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


    PassBookRec: PassBookRec[] = [];

    // Pass:PassBookRec[]=[];
    customerRec: any;

    constructor(private fb: FormBuilder,
                private layoutUtilsService: LayoutUtilsService,
                private spinner: NgxSpinnerService,
                private userUtilsService: UserUtilsService,
                public dialog: MatDialog,
                private _customerService: CustomerService,
                private router: Router,
    ) {
        this.loggedInUser = userUtilsService.getUserDetails();
    }

    ngOnInit() {
        this.createForm()
        this.cpForm.controls['Zone'].setValue(this.loggedInUser.Zone.ZoneName);
        this.cpForm.controls['Branch'].setValue(this.loggedInUser.Branch.Name);

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
            Zone: [''],
            Branch: [''],
            Cnic: ['']
            //NewPassBookNo:['']
        })
    }

    find() {

        var cnic = this.cpForm.controls.Cnic.value;
        this.spinner.show();
        this._customerService.findPassbookCorrection(cnic)
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

    k;

    get rowKeys(): string[] {
        if (!this.PassBookRec || !this.PassBookRec.length) {
            return [];
        }
        this.k = Object.keys(this.PassBookRec[0])

        this.k.splice(0, 2);
        return this.k;
    }

//   onInputChanged(value: string, rowIndex: number, propertyKey: string): void {
//     this.newValue = this.PassBookRec.map((row, index) => {
//       return index !== rowIndex? row: {...row, [propertyKey]: value}
//     })
//
//   }

    inputvalue;

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

}

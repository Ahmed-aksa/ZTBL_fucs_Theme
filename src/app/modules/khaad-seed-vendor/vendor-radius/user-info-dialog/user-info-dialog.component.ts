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
import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';
import {VendorDetail} from '../../class/vendor-detail';
import {KhaadSeedVendorService} from '../../service/khaad-seed-vendor.service';

@Component({
    selector: 'app-user-info-dialog',
    templateUrl: './user-info-dialog.component.html',
    styleUrls: ['./user-info-dialog.component.scss']
})
export class UserInfoDialogComponent implements OnInit {

    vendorDetailForm: FormGroup;
    vendorInfo: any;
    images = [];
    user: any = {}

    public vendor = new VendorDetail();

    constructor(private fb: FormBuilder,
                public dialogRef: MatDialogRef<UserInfoDialogComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private _khaadSeedVendor: KhaadSeedVendorService,
                private layoutUtilsService: LayoutUtilsService,
                private spinner: NgxSpinnerService,
    ) {
    }

    ngOnInit() {
        this.createForm();
        this.getVendor();
        //
    }

    getVendor() {

        this.vendor.Id = this.data.id;

        this.user.ZoneId = this.data.zoneId;
        this.user.BranchCode = this.data.branchCode;
        this.user.CircleId = this.data.circleId;
        var limit = 1, offset = 0;

        this._khaadSeedVendor.searchVendors(limit, offset, this.vendor, this.user)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.vendorInfo = baseResponse.SeedKhadVendor.VendorDetail;

                    this.vendorDetailForm.controls["Name"].setValue(this.vendorInfo.Name);
                    this.vendorDetailForm.controls["TypeName"].setValue(this.vendorInfo.TypeName);
                    this.vendorDetailForm.controls["Description"].setValue(this.vendorInfo.Description);
                    this.vendorDetailForm.controls["PhoneNumber"].setValue(this.vendorInfo.PhoneNumber);
                    this.vendorDetailForm.controls["Address"].setValue(this.vendorInfo.Address);

                    this.images.push(this.vendorInfo.FilePath);

                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            })
    }

    createForm() {
        this.vendorDetailForm = this.fb.group({
            Name: [''],
            PhoneNumber: [''],
            Address: [''],
            Description: [''],
            TypeName: ['']
        })
    }

    close(result: any): void {
        this.dialogRef.close(result);
    }

}

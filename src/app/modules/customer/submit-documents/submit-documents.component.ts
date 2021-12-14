import {Component, Inject, OnInit} from '@angular/core';
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {CustomerService} from "../../../shared/services/customer.service";
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {UserUtilsService} from "../../../shared/services/users_utils.service";

@Component({
    selector: 'app-submit-documents',
    templateUrl: './submit-documents.component.html',
    styleUrls: ['./submit-documents.component.scss']
})
export class SubmitDocumentsComponent implements OnInit {
    rawData: any = [];
    number_of_files: number = 1;

    constructor(
        private layoutUtilsService: LayoutUtilsService,
        public matDialogRef: MatDialogRef<SubmitDocumentsComponent>,
        private spinner: NgxSpinnerService,
        private customerService: CustomerService,
        private userUtilsService: UserUtilsService,
        @Inject(MAT_DIALOG_DATA)
        private cnic) {
    }

    ngOnInit(): void {
    }

    onFileChange(event, i) {
        if (event.target.files && event.target.files[0]) {
            const filesAmount = event.target.files.length;
            const file = event.target.files[0];
            const Name = file.name.split('.').pop();
            if (Name != undefined) {
                if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'jpeg' || Name.toLowerCase() == 'png') {
                    const reader = new FileReader();
                    reader.onload = (event: any) => {
                        if (this.rawData[i]) {
                            this.rawData.splice(i, 1);
                            this.rawData.splice(i, 0, file);
                        } else {
                            this.rawData.push(file);
                        }
                    };
                    reader.readAsDataURL(file);

                } else {
                    this.layoutUtilsService.alertElement('', 'Only jpeg,jpg and png files are allowed', '99');
                    event.target.files = null;
                    return;
                }
            }
        } else {
            this.rawData.splice(i, 1);
        }


    }


    changeNumberOfFiles(value: number) {
        this.number_of_files = Number(value);
    }

    submitDocuments() {
        if (this.rawData.length < this.number_of_files) {
            this.layoutUtilsService.alertElement("", "Please Submit All Documents");
            return 0;
        }
        let has_error = false;
        this.spinner.show();
        this.rawData?.forEach((single_file, index) => {
            if (!has_error) {
                // @ts-ignore
                let description = document.getElementById(`description_${index}`).value;
                let request = {
                    CustomerCnic: this.cnic,
                    Description: description,
                    PageNumber: 1
                }
                this.customerService.submitDocument(request)
                    .pipe(
                        finalize(() => {
                        })
                    ).subscribe((baseResponse) => {
                    if (baseResponse.Success) {
                    } else {
                        this.layoutUtilsService.alertMessage('', baseResponse.Message);
                    }

                });
            } else {
                this.spinner.hide();
                this.layoutUtilsService.alertMessage("", "Something bad happened, Please try again");
                this.matDialogRef.close();
            }
        });
        this.spinner.hide();
        this.matDialogRef.close();
        this.layoutUtilsService.alertElementSuccess("", "Documents Submitted Successfully");


    }
}

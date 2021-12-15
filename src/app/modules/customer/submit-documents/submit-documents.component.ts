import {Component, Inject, OnInit} from '@angular/core';
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {CustomerService} from "../../../shared/services/customer.service";
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {UserUtilsService} from "../../../shared/services/users_utils.service";
import {Lov, LovConfigurationKey} from "../../../shared/classes/lov.class";
import {LovService} from "../../../shared/services/lov.service";
import {ViewFileComponent} from "../../loan-utilization/view-file/view-file.component";

@Component({
    selector: 'app-submit-documents',
    templateUrl: './submit-documents.component.html',
    styleUrls: ['./submit-documents.component.scss']
})
export class SubmitDocumentsComponent implements OnInit {
    rawData: any = [];
    number_of_files: number = 1;
    public LovCall = new Lov();
    document_types: any = [];
    documents: any = [];
    customer: any;
    tranId: number;
    doc_urls: any = []

    constructor(
        private layoutUtilsService: LayoutUtilsService,
        public matDialogRef: MatDialogRef<SubmitDocumentsComponent>,
        private spinner: NgxSpinnerService,
        private customerService: CustomerService,
        private userUtilsService: UserUtilsService,
        private _lovService: LovService,
        private matDialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        private data) {
    }

    ngOnInit(): void {
        this.customer = this.data.customer;
        this.tranId = this.data.tranId;
        this.getDocumentTypes();
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
                            this.doc_urls.push(event.target.result);
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
                // @ts-ignore
                // let document_type = document.getElementById(`document_type_${index}`).value;
                let document_type = this.documents[index];
                // @ts-ignore
                let reference = document.getElementById(`reference_${index}`).value;
                // @ts-ignore
                let general_description = document.getElementById('general_description').value;
                let request = new BaseRequestModel();
                request.DocumentDetail = {
                    DocumentTypeId: document_type,
                    Description: general_description,
                    ReferenceNumber: reference,
                }
                request.Customer = this.customer;
                let all_Data = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
                request.User = all_Data.User;
                request.Zone = all_Data.Zone;
                request.Branch = all_Data.Branch;
                let circles = [];
                let circles_string = "";
                if (all_Data.UserCircleMappings.length > 1) {
                    all_Data.UserCircleMappings.forEach((single_circle) => {
                        circles.push(single_circle.CircleId);
                    })
                    circles_string = circles.toString();

                } else {
                    circles_string = all_Data.UserCircleMappings.CircleId;

                }
                request.Circle = {
                    CircleIds: circles_string
                };
                request.TranId = Number(this.tranId);

                this.customerService.submitDocumentDetails(request).subscribe((data) => {
                    if (data.Success) {


                        var formData = new FormData();


                        formData.append('file', single_file);
                        formData.append('CustomerCnic', this.customer.Cnic);
                        formData.append('Description', description);
                        formData.append('PageNumber', '1');
                        formData.append('DocumentId', data.DocumentDetail.Id);
                        this.customerService.submitDocument(formData)
                            .pipe(
                                finalize(() => {
                                })
                            ).subscribe((baseResponse) => {
                            if (baseResponse.Success) {
                            } else {
                                this.layoutUtilsService.alertMessage('', baseResponse.Message);
                                return;
                            }

                        });
                    } else {
                        this.layoutUtilsService.alertMessage('', data.Message);
                        return 0;
                    }

                })


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

    async getDocumentTypes() {
        this.document_types = await this._lovService.CallLovAPI(this.LovCall = {TagName: LovConfigurationKey.SubmitDocumentType});
    }

    previewImg(url: any) {
        const dialogRef = this.matDialog.open(ViewFileComponent, {
            width: '70%',
            height: '70%',
            data: {url: url}
        });
    }
}

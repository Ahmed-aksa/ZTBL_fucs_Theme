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
import {SubmitDocument} from "../model/submit-document.model";

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
    description: any = [];
    submit_documents: SubmitDocument[] = []
    private current_document_id: any = null;
    private document_details: any;
    general_description: any = "";
    reference: any = "";

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
        this.document_details = this.data.document_details;

        this.patchValues();

        this.getDocumentTypes();
    }

    onFileChange(event, i) {
        if (event.target.files && event.target.files[0]) {
            const filesAmount = event.target.files.length;
            const file = event.target.files[0];
            const Name = file.name.split('.').pop();
            if (Name != undefined) {
            }
            if (Name.toLowerCase() == 'jpg' || Name.toLowerCase() == 'jpeg' || Name.toLowerCase() == 'png') {
                const reader = new FileReader();
                reader.onload = (event: any) => {


                    if (this.doc_urls[i]) {
                        this.doc_urls[i] = event.target.result;
                    } else {
                        this.doc_urls.push(event.target.result);

                    }
                    let has_file = false;
                    this.submit_documents.forEach((single_document, index) => {
                        if (single_document.document_type_id == this.current_document_id.value) {
                            debugger;
                            if (!single_document.CustomerDocuments.filter((single_doc: any) => single_doc?.id == i))
                                single_document.CustomerDocuments.push({
                                    id: i,
                                    Description: "",
                                    PageNumber: "1",
                                    FilePath: file,
                                    url: event.target.result
                                });
                            else {
                                let second_index = single_document.CustomerDocuments.findIndex((single_doc: any) => single_doc?.id == i);
                                this.submit_documents[index].CustomerDocuments[second_index].FilePath = file;
                                this.submit_documents[index].CustomerDocuments[second_index].url = event.target.result;
                            }

                        }
                    })
                };
                reader.readAsDataURL(file);

            } else {
                event.target.value = "";
                this.layoutUtilsService.alertElement('', 'Only jpeg,jpg and png files are allowed', '99');
                event.target.files = null;
                return;
            }
        } else {
            this.rawData.splice(i, 1);
        }


    }


    changeNumberOfFiles(value) {
        this.number_of_files = value ? Number(value) : 0;
        let file_index = this.submit_documents.findIndex(single_document => single_document.document_type_id == this.current_document_id.value);
        this.submit_documents[file_index].number_of_files = value;
    }

    submitDocuments() {
        let has_error = false;
        this.spinner.show();
        debugger;
        if (this.submit_documents.length == 0) {
            this.layoutUtilsService.alertElement("", "Please fill all required data");
            this.spinner.hide();
            return;
        }
        this.submit_documents.forEach((single_document) => {
            if (single_document.CustomerDocuments.length == 0) {
                has_error = true;
            } else {
                single_document.CustomerDocuments.forEach((customer_document) => {

                    if (customer_document.FilePath == null || customer_document.Description == null || single_document.document_type_id) {
                        has_error = true;
                    }
                })
            }
        })

        if (has_error) {
            this.layoutUtilsService.alertElement("", "Please fill all required data");
            this.spinner.hide();
            return;
        }
        this.submit_documents?.forEach((single_file, index) => {
            if (!has_error) {
                let request = new BaseRequestModel();
                request.DocumentDetail = {
                    DocumentTypeId: single_file.document_type_id,
                    Description: single_file.description,
                    ReferenceNumber: single_file.reference,
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
                        single_file.CustomerDocuments.forEach((single_file_document) => {


                            var formData = new FormData();


                            formData.append('file', single_file_document.FilePath);
                            formData.append('CustomerCnic', this.customer.Cnic);
                            formData.append('Description', single_file_document.Description);
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
                        })

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
            width: '100vh',
            height: '100vh',
            data: {url: url}
        });
    }

    private patchValues() {
        // this.document_details.foreach((single_detail) => {
        //
        // })
    }

    changeDocumentType(value: any) {
        this.doc_urls = [];
        this.description = [];
        if (this.current_document_id) {
            let file_index = this.submit_documents.findIndex(single_document => single_document.document_type_id == value.value);
            if (file_index == -1) {
                this.submit_documents.push({
                    CustomerDocuments: [],
                    cnic: this.customer.Cnic,
                    description: "",
                    reference: "",
                    document_type_id: value.value,
                    number_of_files: 1
                })
                this.number_of_files = 1;
                this.general_description = "";
                this.reference = "";
            } else {

                let previous_submitted_document = this.submit_documents[file_index];
                this.number_of_files = this.submit_documents[file_index].number_of_files;
                this.general_description = this.submit_documents[file_index].description;
                this.reference = this.submit_documents[file_index].reference;
                this.submit_documents[file_index].CustomerDocuments.forEach((single_document) => {
                    this.doc_urls.push(single_document.url);
                    this.description.push(single_document.Description);
                })

            }
        } else {
            this.submit_documents.push({
                CustomerDocuments: [],
                cnic: this.customer.Cnic,
                description: this.general_description,
                reference: this.reference,
                document_type_id: value.value,
                number_of_files: this.number_of_files,
            })
        }
        this.current_document_id = value;

    }

    changeTypeData(value: any, type: string, i = 0) {
        let file_index = this.submit_documents.findIndex(single_document => single_document.document_type_id == this.current_document_id.value);
        if (file_index != -1) {
            if (type == 'description') {
                this.submit_documents[file_index].description = value;
            } else if (type == 'reference') {
                this.submit_documents[file_index].reference = value;

            } else if (type == 'file_description') {
                let second_index = this.submit_documents[file_index].CustomerDocuments.findIndex(single_type_document => single_type_document.id == i);
                if (second_index != -1) {
                    this.submit_documents[file_index].CustomerDocuments[second_index].Description = value;
                } else {
                    this.submit_documents[file_index].CustomerDocuments.push({
                        id: i,
                        Description: value,
                        PageNumber: "1",
                        FilePath: null,
                        url: null
                    });
                }
            }
        }
    }
}

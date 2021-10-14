import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Store} from "@ngrx/store";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {KtDialogService} from "../../../shared/services/kt-dialog.service";
import {finalize} from "rxjs/operators";
import {DocumentTypeService} from "../service/document-type.service";
import {DocumentTypeModel} from "../models/document_type.model";
import {AppState} from "../../../shared/reducers";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LayoutUtilsService} from "../../../shared/services/layout-utils.service";

@Component({
    selector: 'app-document-type-edit',
    templateUrl: './document-type-edit.component.html',
    styleUrls: ['./document-type-edit.component.scss']
})
export class DocumentTypeEditComponent implements OnInit {

    saving = false;
    submitted = false;
    documentTypeForm: FormGroup;
    public documentType = new DocumentTypeModel();
    hasFormErrors = false;
    viewLoading = false;
    loadingAfterSubmit = false;


    constructor(public dialogRef: MatDialogRef<DocumentTypeEditComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private store: Store<AppState>,
                private _documentTypeService: DocumentTypeService,
                private formBuilder: FormBuilder,
                private layoutUtilsService: LayoutUtilsService,
                private _snackBar: MatSnackBar) {
    }

    ngOnInit() {

        this.documentType.clear();

        if (this.data.docuemtnType && this.data.docuemtnType.Id) {
            this.documentType = this.data.docuemtnType;
        }

        this.createForm();
    }


    createForm() {

        this.documentTypeForm = this.formBuilder.group({
            Name: [this.documentType.Name, [Validators.required, Validators.maxLength(30)]],
            NoOfPages: [this.documentType.NoOfPages, [Validators.required, Validators.maxLength(60)]],
        });

    }


    hasError(controlName: string, errorName: string): boolean {
        return this.documentTypeForm.controls[controlName].hasError(errorName);
    }


    get f(): any {
        return this.documentTypeForm.controls;
    }


    onSubmit(): void {
        this.hasFormErrors = false;
        if (this.documentTypeForm.invalid) {
            const controls = this.documentTypeForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }
        this.documentType = Object.assign(this.documentType, this.documentTypeForm.value);

        if (this.documentType.NoOfPages == '0') {
            this.layoutUtilsService.alertElement("", "Number of pages should greater than zero", "Invalid Number of pages");
            return
        }
        this.submitted = true;

        if (this.data.docuemtnType.Id > 0) {
            this._documentTypeService
                .UpdateDocumentType(this.documentType)
                .pipe(
                    finalize(() => {
                        this.submitted = false;
                        this.dialogRef.close()
                    })
                )
                .subscribe((baseResponse: BaseResponseModel) => {
                    console.log(baseResponse);
                    if (baseResponse.Success === true) {
                        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);

                        this.close(this.documentType);
                    } else {
                        this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                    }
                });
        } else {

            this._documentTypeService
                .AddDocumentType(this.documentType)
                .pipe(
                    finalize(() => {
                        this.submitted = false;
                        this.dialogRef.close()
                    })
                )
                .subscribe((baseResponse: BaseResponseModel) => {
                    if (baseResponse.Success === true) {
                        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                        this.close(this.documentType);
                    } else {
                        const message = `An error occure.`;
                        this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                    }

                });
        }

    }


    close(result: any): void {
        this.dialogRef.close(result);
    }


    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    getTitle(): string {
        if (this.data && this.data.docuemtnType.Id) {
            return 'Edit DocumentType';
        }
        return 'New DocumentType';
    }


}

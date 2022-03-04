import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {Configuration} from "../models/configuration.model";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Store} from "@ngrx/store";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {finalize} from "rxjs/operators";
import {ConfigurationService} from "../service/configuration.service";
import {AppState} from "../../../shared/reducers";
import {MatSnackBar} from "@angular/material/snack-bar";
import {LayoutUtilsService} from "../../../shared/services/layout-utils.service";

@Component({
    selector: 'app-configuration-edit',
    templateUrl: './configuration-edit.component.html',
    styleUrls: ['./configuration-edit.component.scss']
})
export class ConfigurationEditComponent implements OnInit {

    saving = false;
    submitted = false;
    configurationForm: FormGroup;
    configuration: Configuration = new Configuration();
    hasFormErrors = false;
    viewLoading = false;
    loadingAfterSubmit = false;
    Inputhint: string;
    lovDesc: string;
    lovList: any = [];
    isClob = false;
    isModel = false;
    is_parent: boolean = false;
    editModel: any = {};
    keyValuePatternErrorMessage = null;
    parents: any;
    is_edit = false;

    constructor(public dialogRef: MatDialogRef<ConfigurationEditComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private store: Store<AppState>,
                private _configurationService: ConfigurationService,
                private formBuilder: FormBuilder,
                private layoutUtilsService: LayoutUtilsService,
                private _snackBar: MatSnackBar) {
    }

    get f(): any {
        return this.configurationForm.controls;
    }

    ngOnInit() {
        this.configuration.clear();

        if (this.data.configuration && this.data.configuration.KeyID) {
            this.configuration = this.data.configuration;
        }

        this.createForm();

        this.Inputhint = this.configuration.Description;
        this.getParents();
    }

    createForm() {

        this.configurationForm = this.formBuilder.group({
            KeyName: new FormControl({value: ''}, [Validators.required]),
            KeyValue: [this.configuration.KeyValue, [Validators.required]],
            KeyValueClob: [this.configuration.KeyValueClob],
            IsParent: [this.configuration.IsParent],
            ParentID: [this.configuration.ParentID],
            Description: [this.configuration.Description, Validators.required]
        });
        this.configurationForm.controls['KeyName'].setValue(this.configuration.KeyName);
        if (this.configuration.KeyName != '') {
            this.configurationForm.controls['KeyName'].disable();
            this.is_edit = true;
        }

    }

    hasError(controlName: string, errorName: string): boolean {
        return this.configurationForm.controls[controlName].hasError(errorName);
    }

    onSubmit(): void {
        //this.configuration.clear();

        this.hasFormErrors = false;
        if (this.configurationForm.invalid) {
            const controls = this.configurationForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }

        this.configuration = Object.assign(this.configuration, this.configurationForm.value);

        this.submitted = true;
        this._configurationService.AddUpdateConfiguration(this.configuration)
            .pipe(
                finalize(() => {
                    this.submitted = false;
                    this.dialogRef.close()
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                console.log(baseResponse);
                if (baseResponse.Success === true) {
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);
                    this.close(this.configuration);
                } else {
                    this.layoutUtilsService.alertElement('', baseResponse.Message, baseResponse.Code);
                }
            });
    }

    onChange(params) {
        this.manageKeyValue(params.value);
    }

    manageKeyValue(type: any) {

        if (type == 'String') {
            this.isClob = false;
        }
        if (type == 'Numaric') {

            this.isClob = false;
        }

        if (type == 'CLOB') {

            this.isClob = true;
        }

    }


    close(result: any): void {
        this.dialogRef.close(result);
    }


    onAlertClose($event) {
        this.hasFormErrors = false;
    }

    getTitle(): string {
        if (this.data && this.data.configuration.KeyID) {
            return 'Edit configuration';
        }
        return 'New configuration';
    }

    changedParentStatus() {
        if (this.configurationForm.value.IsParent == false) {
            this.is_parent = false;
        } else {
            this.is_parent = true;
        }
    }

    private getParents() {
        this._configurationService.getParents().subscribe((data: any) => {
            this.parents = data.Configurations;
        });
    }
}

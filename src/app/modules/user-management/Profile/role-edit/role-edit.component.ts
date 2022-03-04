import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {BaseResponseModel} from 'app/shared/models/base_response.model';
import {KtDialogService} from 'app/shared/services/kt-dialog.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {ProfileService} from 'app/shared/services/profile.service';
import {finalize} from 'rxjs/operators';
import {Activity, Profile} from '../../activity/activity.model';

@Component({
    selector: 'kt-role-edit',
    templateUrl: './role-edit.component.html'
})
export class RoleEditComponent implements OnInit {

    saving = false;
    submitted = false;
    LOVs;
    roleForm: FormGroup;
    profile: Profile = new Profile();
    hasFormErrors = false;
    viewLoading = false;
    loadingAfterSubmit = false;
    _currentActivity: Activity = new Activity();

    AccessToData = [
        {Id: "1", Name: "All"},
        {Id: "2", Name: "Zone"},
        {Id: "3", Name: "Branch"}]


    constructor(public dialogRef: MatDialogRef<RoleEditComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private formBuilder: FormBuilder,
                private _profileService: ProfileService,
                private layoutUtilsService: LayoutUtilsService,
                private ktDialogService: KtDialogService,
                private _snackBar: MatSnackBar) {
    }

    get f(): any {
        return this.roleForm.controls;
    }

    ngOnInit() {

        this.getRoles();

        // var u = new UserUtilsService();
        //this._currentActivity = u.getActivity('Circles');


        if (this.data.profile && this.data.profile.ProfileID > 0) {
            this.profile = this.data.profile;
        }

        this.createForm();
    }

    getRoles() {

        // this.spinner.show();
        this._profileService
            .getRoleGroups()
            .pipe(finalize(() => {
                // this.spinner.hide();
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {

                    this.LOVs = baseResponse.LOVs;


                    // this.dataSource = baseResponse.DeceasedCustomer.DeceasedCustomerDisbursementRecoveries;
                    //
                    // this.DeceasedCustomerAttachedFile = baseResponse.ViewDocumnetsList
                } else {

                    this.layoutUtilsService.alertElement(
                        "",
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }

            });
    }

    //regex edited from https://stackoverflow.com/questions/12018245/regular-expression-to-validate-username
    createForm() {
        this.roleForm = this.formBuilder.group({
            /*ProfileName: [this.profile.ProfileName, [Validators.required, Validators.pattern('^(?=.*[a-zA-Z])[a-zA-Z]+$')]],*/
            ProfileName: [this.profile.ProfileName, [Validators.required, Validators.pattern('^(?=.{2,30}$)(?![_. ])(?!.*[_. ]{2})[a-zA-Z0-9._ ]+(?<![_. ])$')]],
            AccessToData: [1, [Validators.required]],
            ProfileID: [this.profile.ProfileID, [Validators.required]]

        });

    }

    hasError(controlName: string, errorName: string): boolean {
        return this.roleForm.controls[controlName].hasError(errorName);
    }

    onSubmit(): void {

        this.hasFormErrors = false;
        if (this.roleForm.invalid) {
            const controls = this.roleForm.controls;
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );

            this.hasFormErrors = true;
            return;
        }
        this.profile = Object.assign(this.profile, this.roleForm.value);

        this.submitted = true;
        this.ktDialogService.show();

        if (this.data.profile.ProfileID > 0) {


            this._profileService.UpdateRole(this.profile)
                .pipe(
                    finalize(() => {
                        this.submitted = false;
                        this.ktDialogService.hide();
                    })
                )
                .subscribe((baseResponse: BaseResponseModel) => {


                    if (baseResponse.Success === true) {
                        const message = `Polygon has been updated successfully`;
                        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                        this.close(this.profile);
                    } else {
                        const message = `An error occure.`;
                        this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);
                    }

                });

        } else {
            this._profileService.AddNewRole(this.profile)
                .pipe(
                    finalize(() => {
                        this.submitted = false;
                        this.ktDialogService.hide();
                    })
                )
                .subscribe((baseResponse: BaseResponseModel) => {


                    if (baseResponse.Success === true) {
                        const message = `Polygon has been updated successfully`;
                        this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);

                        this.close(this.profile);
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


        if (this.data.profile.ProfileID > 0) {

            return 'Edit Role';
        }
        return 'New Role';
    }
}

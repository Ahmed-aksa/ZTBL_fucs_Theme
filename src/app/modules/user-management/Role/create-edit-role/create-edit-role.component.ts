import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {DateAdapter} from '@angular/material/core';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {FuseAlertService} from '@fuse/components/alert';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {ProfileService} from 'app/shared/services/profile.service';
import {each} from 'lodash';
import {NgxSpinnerService} from 'ngx-spinner';
import {ToastrService} from 'ngx-toastr';
import {Observable, Subscription} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {Profile} from '../../activity/activity.model';
import {Permission} from '../../assign-pages/permission.model';
import {Role} from '../../assign-pages/role.model';


@Component({
    selector: 'app-create-edit-role',
    templateUrl: './create-edit-role.component.html',
    styleUrls: ['./create-edit-role.component.scss']
})
export class CreateEditRoleComponent implements OnInit, OnDestroy {


    roleForm: FormGroup;
    role: Role;
    LOVs;
    caseUpdate = false;
    role$: Observable<Role>;
    public profile = new Profile;
    hasFormErrors = false;
    viewLoading = false;
    loadingAfterSubmit = false;
    allPermissions$: Observable<Permission[]>;
    rolePermissions: Permission[] = [];
    private componentSubscriptions: Subscription;

    constructor(public dialogRef: MatDialogRef<CreateEditRoleComponent>,
                @Inject(MAT_DIALOG_DATA) public data: any,
                private fb: FormBuilder,
                private _profileService: ProfileService,
                private layoutUtilsService: LayoutUtilsService,
                private spinner: NgxSpinnerService) {


    }

    ngOnInit() {
        this.spinner.show();
        setTimeout(() => {
            this.spinner.hide();
        }, 1000);

        this.setup();
        this.getRoles();
        this.createForm();

    }

    setup() {
        this.profile = this.data.profile;
        if (this.data.profile.ProfileID > 0) {
            this.caseUpdate = true;
        } else {
            this.caseUpdate = false;
        }
    }

    getRoles() {
        this._profileService
            .getRoleGroups()
            .pipe(finalize(() => {
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.LOVs = baseResponse.LOVs;
                } else {
                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }
            });
    }


    ngOnDestroy() {
        if (this.componentSubscriptions) {
            this.componentSubscriptions.unsubscribe();
        }
    }


    createForm() {
        this.roleForm = this.fb.group({
            ProfileID: [this.profile.ProfileID, Validators.required],
            ProfileName: [this.profile.ProfileName, Validators.required],
            ProfileDesc: [this.profile.ProfileDesc, Validators.required],
            ActivityList: [this.profile.ActivityList, Validators.required],
            ChannelID: [this.profile.ChannelID, Validators.required],
            CreatedBy: [this.profile.CreatedBy, Validators.required],
            UpdatedBy: [this.profile.UpdatedBy, Validators.required],
            EndedBy: [this.profile.EndedBy, Validators.required],
            Status: [this.profile.Status, Validators.required],
            isSelected: [this.profile.isSelected, Validators.required],
            AccessToData: [this.profile.AccessToData, Validators.required],

        });

        if (this.caseUpdate == true) {
            this.roleForm.controls.ProfileID.disable();
        }

    }

    preparePermissionIds(): number[] {
        const result = [];
        each(this.rolePermissions, (_root: Permission) => {
            if (_root.isSelected) {
                result.push(_root.id);
                each(_root._children, (_child: Permission) => {
                    if (_child.isSelected) {
                        result.push(_child.id);
                    }
                });
            }
        });
        return result;
    }


    prepareRole(): Role {
        const _role = new Role();
        _role.id = this.role.id;
        _role.permissions = this.preparePermissionIds();
        _role.title = this.role.title;
        _role.isCoreRole = this.role.isCoreRole;
        return _role;
    }


    onSubmit() {
        this.profile = Object.assign(this.profile, this.roleForm.value);
        if (this.caseUpdate == true) {
            this.Update(this.profile);
        } else {
            this.Add(this.profile);
        }
    }

    Update(val: any) {

        this._profileService
            .UpdateRole(val)
            .pipe(finalize(() => {
                // this.spinner.hide();
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    const message = `Polygon has been updated successfully`;
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);


                } else {

                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }

            });
    }

    onAlertClose() {
    }

    Add(val: any) {

        this._profileService.AddNewRole(val)
            .pipe(finalize(() => {
                this.caseUpdate = false;
                // this.spinner.hide();
            }))
            .subscribe((baseResponse) => {
                if (baseResponse.Success) {
                    this.layoutUtilsService.alertElementSuccess('', baseResponse.Message, baseResponse.Code);


                } else {

                    this.layoutUtilsService.alertElement(
                        '',
                        baseResponse.Message,
                        baseResponse.Code
                    );
                }

            });
    }

    /** UI */
    /**
     * Returns component title
     */
    getTitle(): string {
        if (this.caseUpdate == true) {
            // tslint:disable-next-line:no-string-throw
            return 'Edit role';
        }

        // tslint:disable-next-line:no-string-throw
        return 'New role';
    }

    /**
     * Returns is title valid
     */
    isTitleValid(): boolean {
        return (this.role && this.role.title && this.role.title.length > 0);
    }
}

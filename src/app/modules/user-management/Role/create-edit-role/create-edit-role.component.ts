import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DateAdapter } from '@angular/material/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { LayoutUtilsService } from 'app/shared/services/layout_utils.service';
import { ProfileService } from 'app/shared/services/profile.service';
import { ToastrService } from 'ngx-toastr';
import { finalize } from 'rxjs/operators';


@Component({
  selector: 'app-create-edit-role',
  templateUrl: './create-edit-role.component.html',
  styleUrls: ['./create-edit-role.component.scss']
})
export class CreateEditRoleComponent implements OnInit {

  formFieldHelpers: string[] = [''];
  createOrEditFrom: FormGroup;
  submitted = false;
  LOVs;
  isUpdate: boolean = false;
  constructor(private formBuilder: FormBuilder, private _profileService: ProfileService,
    private layoutUtilsService: LayoutUtilsService,
    private dialogRef: MatDialogRef<CreateEditRoleComponent>,
    private _fuseAlertService: FuseAlertService,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private toastrService:ToastrService ) { }

  ngOnInit(): void {
    this.createOrEditFrom = this.formBuilder.group({
      ProfileName: ['', Validators.required],
      ProfileDesc: ['', Validators.required],
      ProfileID: ['', Validators.required],

    });
    this.getRoles();
    if (this.data.profile) {
      this.isUpdate = true;
      this.createOrEditFrom.patchValue({
        ProfileName: this.data.profile.ProfileName,
        ProfileDesc: this.data.profile.GroupName,
        ProfileID: this.data.profile.ProfileID,
      });
    }

  }
  get f() { return this.createOrEditFrom.controls; }

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


  onSubmit() {

    this.submitted = true;
    if (this.createOrEditFrom.invalid) {
      return;
    }
    this.createOrEditFrom.disable();
    this.createOrEditFrom.enable();
    if (this.isUpdate) {
      this._profileService.updateProfile(this.createOrEditFrom.value).subscribe(result => {
        this.dialogRef.close();
        this.toastrService.success("Action Profrom Successfully");
      }, error => {
        this.createOrEditFrom.enable();
      });

    }
    else {
      this._profileService.AddNewRole(this.createOrEditFrom.value).subscribe(result => {
        this.dialogRef.close();
        this.toastrService.success("Action Profrom Successfully");
      }, error => {
        this.createOrEditFrom.enable();
      });
    }
    }
  public errorHandling = (controlName: string, errorName: string) => {
    return this.createOrEditFrom.controls[controlName].hasError(errorName);
  }

}




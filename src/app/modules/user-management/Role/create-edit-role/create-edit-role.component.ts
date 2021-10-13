import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { FuseAlertService } from '@fuse/components/alert';
import { ProfileService } from 'app/shared/services/profile.service';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-create-edit-role',
  templateUrl: './create-edit-role.component.html',
  styleUrls: ['./create-edit-role.component.scss']
})
export class CreateEditRoleComponent implements OnInit {

  formFieldHelpers: string[] = [''];
  createOrEditFrom: FormGroup;
  submitted = false;

  constructor(private formBuilder: FormBuilder, private userProfileService: ProfileService,
    private dialogRef: MatDialogRef<CreateEditRoleComponent>,
    private _fuseAlertService: FuseAlertService,
    private toastrService:ToastrService ) { }

  ngOnInit(): void {
    this.createOrEditFrom = this.formBuilder.group({

      ProfileName: ['', Validators.required],
      ProfileDesc: ['', Validators.required],
      ProfileID: ['', Validators.required],

    },);
  }
  get f() { return this.createOrEditFrom.controls; }


  
  onSubmit() {
    debugger;
    this.submitted = true;
    if (this.createOrEditFrom.invalid) {
      return;
    }
    this.createOrEditFrom.disable();
    this.userProfileService.UpdateRole(this.createOrEditFrom.value).subscribe(result => {
      this.createOrEditFrom.enable();
      this.dialogRef.close();
      this.toastrService.success("Action Profrom Successfully");
    }, error => {
      this.createOrEditFrom.enable();
    });
  }


  public errorHandling = (controlName: string, errorName: string) => {
    return this.createOrEditFrom.controls[controlName].hasError(errorName);
  }

}




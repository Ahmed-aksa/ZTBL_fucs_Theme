import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ToastrService} from "ngx-toastr";
import {AuthService} from "../../../core/auth/auth.service";
import {MatDialogRef} from "@angular/material/dialog";

@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
    change_password_form: FormGroup;

    constructor(private fb: FormBuilder, private toastr: ToastrService, private authService: AuthService, private matDialogRef: MatDialogRef<ChangePasswordComponent>) {
    }

    ngOnInit(): void {
        this.createForm();
    }

    private createForm() {
        this.change_password_form = this.fb.group({
            old_password: [],
            new_password: [],
            confirm_password: []
        })
    }

    changePassword() {
        if (this.change_password_form.value.new_password != this.change_password_form.value.confirm_password) {
            document.getElementById('error_to_display').innerHTML = "Password Confirmation Failed";
            document.getElementById('success_to_display').innerHTML = '';

        } else {
            this.authService.changePassword(this.change_password_form.value.old_password, this.change_password_form.value.new_password).subscribe((data: any) => {
                if (data.Success) {
                    document.getElementById('success_to_display').innerHTML = data.Message;
                    document.getElementById('error_to_display').innerHTML = '';
                    this.matDialogRef.close('true')
                } else {
                    document.getElementById('error_to_display').innerHTML = data.Message;
                    document.getElementById('success_to_display').innerHTML = '';

                }
            });
        }
    }

    close() {
        this.matDialogRef.close();
    }
}

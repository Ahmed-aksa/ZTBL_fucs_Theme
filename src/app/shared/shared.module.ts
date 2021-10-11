import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ToastrModule} from "ngx-toastr";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
    ],
    exports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        ToastrModule,

    ]
})
export class SharedModule {
}

/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/member-ordering */
/* eslint-disable radix */
/* eslint-disable @angular-eslint/use-lifecycle-interface */
/* eslint-disable curly */
/* eslint-disable guard-for-in */
/* eslint-disable space-before-function-paren */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable arrow-parens */
/* eslint-disable no-debugger */
/* eslint-disable prefer-const */
/* eslint-disable eol-last */
/* eslint-disable one-var */
/* eslint-disable no-var */
/* eslint-disable @typescript-eslint/type-annotation-spacing */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/semi */
/* eslint-disable quotes */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable eqeqeq */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/naming-convention */

import { Component, Inject, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef, MAT_DIALOG_DATA } from "@angular/material/dialog";
import { MatTableDataSource } from "@angular/material/table";
import { GlConfigrationsDetail } from "app/shared/models/loan-application-header.model";
import { LayoutUtilsService } from "app/shared/services/layout_utils.service";
import { LoanService } from "app/shared/services/loan.service";
import { NgxSpinnerService } from "ngx-spinner";
import { finalize } from "rxjs/operators";

@Component({
  selector: 'new-gl-code',
  templateUrl: './new-gl-code.component.html',
  styleUrls: ['./new-gl-code.component.scss']
})
export class NewGlCodeComponent implements OnInit {
 
  aa: any;
  glDialogForm: FormGroup;
  public glConfigrationsDetail = new GlConfigrationsDetail();
  loading: boolean;
  CropDetailList: any;
  GLDetailList: any;
  GlRangeDetailList: any;
  GlSchemeCropDetailList: any;
  SchemeDetailList: any;
  hasFormErrors = false;
  errorShow = false;
  
  field :boolean = false;
  table: boolean = false;

  cdlfield :boolean = false;
  cdltable: boolean = false;
  
  gdlfield :boolean = false;
  gdltable: boolean = false;

  glrfield :boolean = false;
  glrtable: boolean = false;

  glsfield :boolean = false;
  glstable: boolean = false;

  sdlfield :boolean = false;
  sdltable: boolean = false;

  bgRow: boolean;

  displayedColumns = ['Id', 'TransactionId', 'ApiName', 'CallDateTime', 'ResponseDateTime', 'Unit', 'Rate', 'InstallmentFreq'];

  dv: any;
  count: any;

  dataSource = new MatTableDataSource();

  constructor(private fb:FormBuilder,
    private _loanService: LoanService,
    private spinner: NgxSpinnerService,
    private layoutUtilsService: LayoutUtilsService,
    private dialogRef: MatDialogRef<NewGlCodeComponent>,
    @Inject(MAT_DIALOG_DATA) data
    ) { 
      
  debugger
      this.aa = data
      // this.datta(data)
    }

    size = 10; //Default Items Per Page
    //p : number =1;
    pageIndex = 1; //Page Number
    length: any; //Data Length or Total Items from Api

    
  ngOnInit() {
    this.createForm();
    this.setDefaultValue();
    
    if(this.glDialogForm.controls.GLCode.value != ''){
      this.getGlCode();
    }


  }
  setDefaultValue(){
    debugger
    this.glDialogForm.controls["GLCode"].setValue(this.aa.NGlC);
  }

  paginate(event: any) {

    
    this.pageIndex = event;
    this.dataSource = this.dv.slice(event * this.size - this.size, event * this.size);



  }

  createForm(){
    this.glDialogForm = this.fb.group({
      GLCode:['', Validators.required],
      SchemeCode:[''],
      CropCode:['']
    })
  }
  // datta(data)
  // {
  //   debugger
  //   this.glDialogForm.controls["GLCode"].setValue(data.NGlC);
  // }

  onAlertClose($event) {
    this.hasFormErrors = false;
  }

  hasError(controlName: string, errorName: string): boolean {
    return this.glDialogForm.controls[controlName].hasError(errorName);
  }


  getGlCode(){
    debugger
    this.spinner.show();
    this.glConfigrationsDetail = Object.assign(this.glConfigrationsDetail, this.glDialogForm.getRawValue());
    this._loanService.SearchGLCode(this.glConfigrationsDetail)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        debugger
        if (baseResponse.Success) {
          debugger
          console.log(baseResponse)

          this.table = true;
          this.CropDetailList = baseResponse.Loan.GlConfigrationsDetail.CropDetailList;
          this.GLDetailList = baseResponse.Loan.GlConfigrationsDetail.GLDetailList;
          this.GlRangeDetailList = baseResponse.Loan.GlConfigrationsDetail.GlRangeDetailList;
          this.GlSchemeCropDetailList = baseResponse.Loan.GlConfigrationsDetail.GlSchemeCropDetailList;
          this.SchemeDetailList = baseResponse.Loan.GlConfigrationsDetail.SchemeDetailList;

          if(this.CropDetailList == undefined){
            this.cdltable = false;
            this.cdlfield = true;
          }
          else{
            this.cdltable = true;
            this.cdlfield = false;
          }

          if(this.GLDetailList == undefined){
            this.gdltable = false;
            this.gdlfield = true;
          }
          else{
            this.gdltable = true;
            this.gdlfield = false;
          }

          if(this.GlRangeDetailList == undefined ){
            this.glrtable = false;
            this.glrfield = true;
          }
          else{
            this.glrtable = true;
            this.glrfield = false;
          }

          if(this.GlSchemeCropDetailList == undefined){
            this.glstable = false;
            this.glsfield = true;
          }
          else{
            this.glstable = true;
            this.glsfield = false;
          }

          if(this.SchemeDetailList == undefined){
            this.sdltable = false;
            this.sdlfield = true;
          }
          else{
            this.sdltable = true;
            this.sdlfield = false;
          }
          

          

          console.log(this.CropDetailList);
          console.log(this.GLDetailList);
          console.log(this.GlRangeDetailList);
          console.log(this.GlSchemeCropDetailList);
          console.log(this.SchemeDetailList);


          this.dv = this.CropDetailList;

          this.dataSource = new MatTableDataSource(this.CropDetailList.reverse());
          
          this.length = this.CropDetailList.length;
          //this.count = length.count;
          //for()
          this.paginate(this.pageIndex);
          console.log(this.dataSource);
          //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        }
        else {
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        }
      });
  }

  find(){
    this.spinner.show();
    this.errorShow = false;
    this.hasFormErrors = false;

   

    if (this.glDialogForm.invalid) {
      const controls = this.glDialogForm.controls;
      Object.keys(controls).forEach(controlName =>
        controls[controlName].markAsTouched()
      );
      this.table = false;
      this.hasFormErrors = true;
      this.spinner.hide();
      return;
    }

      if(this.glDialogForm.value == '' && this.glDialogForm.value == undefined && this.glDialogForm.value == null){
      //this.Field = true;
      this.table = false;
    }
    debugger
    this.glConfigrationsDetail = Object.assign(this.glConfigrationsDetail, this.glDialogForm.getRawValue());

    this._loanService.SearchGLCode(this.glConfigrationsDetail)
      .pipe(
        finalize(() => {
          this.spinner.hide();
        })
      )
      .subscribe(baseResponse => {
        debugger
        if (baseResponse.Success) {
          debugger

          this.table = true;
          this.CropDetailList = baseResponse.Loan.GlConfigrationsDetail.CropDetailList;
          this.GLDetailList = baseResponse.Loan.GlConfigrationsDetail.GLDetailList;
          this.GlRangeDetailList = baseResponse.Loan.GlConfigrationsDetail.GlRangeDetailList;
          this.GlSchemeCropDetailList = baseResponse.Loan.GlConfigrationsDetail.GlSchemeCropDetailList;
          this.SchemeDetailList = baseResponse.Loan.GlConfigrationsDetail.SchemeDetailList;
          

          console.log(this.CropDetailList);
          console.log(this.GLDetailList);
          console.log(this.GlRangeDetailList);
          console.log(this.GlSchemeCropDetailList);
          console.log(this.SchemeDetailList);

          // if(this.CropDetailList.length == 0 || this.GLDetailList.length == 0 || this.GlRangeDetailList.length == 0 || this.GlSchemeCropDetailList.length == 0 || this.SchemeDetailList.length == 0){
          //   this.table = false;
          //   this.field = true;
          // }

          debugger

          if(this.CropDetailList == undefined){
            this.cdltable = false;
            this.cdlfield = true;
          }
          else{
            this.cdltable = true;
            this.cdlfield = false;
          }

          if(this.GLDetailList == undefined){
            this.gdltable = false;
            this.gdlfield = true;
          }
          else{
            this.gdltable = true;
            this.gdlfield = false;
          }

          if(this.GlRangeDetailList == undefined ){
            this.glrtable = false;
            this.glrfield = true;
          }
          else{
            this.glrtable = true;
            this.glrfield = false;
          }

          if(this.GlSchemeCropDetailList == undefined){
            this.glstable = false;
            this.glsfield = true;
          }
          else{
            this.glstable = true;
            this.glsfield = false;
          }

          if(this.SchemeDetailList == undefined){
            this.sdltable = false;
            this.sdlfield = true;
          }
          else{
            this.sdltable = true;
            this.sdlfield = false;
          }


          this.dv = this.CropDetailList;

          this.dataSource = new MatTableDataSource(this.CropDetailList.reverse());
          
          this.length = this.CropDetailList.length;
          //this.count = length.count;
          //for()
          this.paginate(this.pageIndex);
          console.log(this.dataSource);
          //this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
        }
        else {
          this.spinner.hide();
          this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
          this.table = false;
        }
      });
  }

  onCloseClick(): void {
    
    this.dialogRef.close({ data: {} }); // Keep only this row
  }

}

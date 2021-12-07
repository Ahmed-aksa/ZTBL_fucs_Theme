import {Component, OnInit, ChangeDetectorRef, Inject, ViewChild, ElementRef} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {GlConfigrationsDetail} from 'app/shared/models/Loan.model';
import {CommonService} from 'app/shared/services/common.service';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';
import {LoanService} from 'app/shared/services/loan.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {finalize} from 'rxjs/operators';


export interface Data {
    albumId: number,
    id: number,
    title: string,
    url: string,
    thumnailUrl: string
}

@Component({
    selector: 'kt-cl-gl-scheme-crop-configuration',
    templateUrl: './cl-gl-scheme-crop-configuration.component.html',
    styleUrls: ['./cl-gl-scheme-crop-configuration.component.scss']
})
export class ClGlSchemeCropConfigurationComponent implements OnInit {

    glSchemeCropConfigForm: FormGroup;
    public glConfigrationsDetail = new GlConfigrationsDetail();
    CropDetailList: any;
    GLDetailList: any;
    GlRangeDetailList: any;
    GlSchemeCropDetailList: any;
    SchemeDetailList: any;
    gridHeight: string;

    dataSource = new MatTableDataSource();

    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;

    displayedColumns = ['Id', 'TransactionId', 'ApiName', 'CallDateTime', 'ResponseDateTime', 'Unit', 'Rate', 'InstallmentFreq'];
    //collection = [];
    //config : any;
    //totalRecords:number | any;
    //page:number =1
    dv: any;
    count: any;

    //dataSource: MatTableDataSource<Data> | any;

    constructor(
        public dialogRef: MatDialogRef<ClGlSchemeCropConfigurationComponent>,
        @Inject(MAT_DIALOG_DATA) public data: any,
        private formBuilder: FormBuilder,
        private layoutUtilsService: LayoutUtilsService,
        private _loanService: LoanService,
        private spinner: NgxSpinnerService,
        private _common: CommonService) {
    }


    size = 10; //Default Items Per Page
    //p : number =1;
    pageIndex = 1; //Page Number
    length: any; //Data Length or Total Items from Api


    ngOnInit() {

        this.glConfigrationsDetail.GLCode = this.data.glConfigrationsDetail;
        this.createForm();
        // this.loadData();
    }


    getTitle(): string {

        return "GL Schemes Crop Configuration";
    }

    ngAfterViewInit() {

        this.gridHeight = window.innerHeight - 335 + 'px';
    }

    //loadData() {

    //
    //  this._landService.getData2().subscribe((data: any) => {
    //    this.dv = data;

    //    this.dataSource = new MatTableDataSource(data.reverse());
    //
    //    this.length = data.length;
    //    //this.count = length.count;
    //    //for()
    //    this.paginate(this.pageIndex);
    //    console.log(this.dataSource);
    //  });
    //}


    paginate(event: any) {


        this.pageIndex = event;
        // this.dataService.getData2().subscribe((data:any)=>{
        // this.dataSource = data.slice(event * this.size - this.size, event * this.size);
        // })
        this.dataSource = this.dv?.slice(event * this.size - this.size, event * this.size);


    }


    createForm() {
        this.glSchemeCropConfigForm = this.formBuilder.group({
            GLCode: [this.glConfigrationsDetail.GLCode],
            SchemeCode: [this.glConfigrationsDetail.SchemeCode],
            CropCode: [this.glConfigrationsDetail.CropCode],
        });
    }


    hasError(controlName: string, errorName: string): boolean {
        return this.glSchemeCropConfigForm.controls[controlName].hasError(errorName);
    }


    SearchGLCode() {


        this.glConfigrationsDetail = Object.assign(this.glConfigrationsDetail, this.glSchemeCropConfigForm.getRawValue());
        this.spinner.show();
        this._loanService.SearchGLCode(this.glConfigrationsDetail)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe(baseResponse => {

                if (baseResponse.Success) {
                    this.CropDetailList = baseResponse.Loan.GlConfigrationsDetail.CropDetailList;
                    this.GLDetailList = baseResponse.Loan.GlConfigrationsDetail.GLDetailList;
                    this.GlRangeDetailList = baseResponse.Loan.GlConfigrationsDetail.GlRangeDetailList;
                    this.GlSchemeCropDetailList = baseResponse.Loan.GlConfigrationsDetail.GlSchemeCropDetailList;
                    this.SchemeDetailList = baseResponse.Loan.GlConfigrationsDetail.SchemeDetailList;


                    this.dv = this.CropDetailList;

                    this.dataSource = new MatTableDataSource(this.CropDetailList);

                    this.length = this.CropDetailList?.length;

                    this.paginate(this.pageIndex);


                } else {
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message, baseResponse.Code);
                }
            });
    }

    close() {
        this.glSchemeCropConfigForm.controls.GLCode.value
        if (this.glSchemeCropConfigForm.controls.GLCode.value == "") {

            return
        }
        this.glSchemeCropConfigForm.controls.GLCode.value;
        this.dialogRef.close({data: this.glSchemeCropConfigForm.controls.GLCode.value})


    }

    onCloseClick(): void {
        this.dialogRef.close(); // Keep only this row
    }
}

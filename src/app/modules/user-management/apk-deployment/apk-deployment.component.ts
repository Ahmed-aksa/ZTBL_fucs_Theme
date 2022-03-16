import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import { Documents } from 'app/shared/models/deceased_customer.model';
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import { finalize } from 'rxjs/operators';
import {ApkUploadService} from "../../../shared/services/apk-upload.service";
import {NgxSpinnerService} from "ngx-spinner";
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";

@Component({
    selector: 'app-apk-deployment',
    templateUrl: './apk-deployment.component.html',
    styleUrls: ['./apk-deployment.component.scss']
})
export class ApkDeploymentComponent implements OnInit {

    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    image;
    video;
    pdf;
    apk;

    dataSource = new MatTableDataSource();
    loading: boolean;
    gridHeight: string;
    rawData = new Documents();
    imageUrl: any;
    visible: any = true;
    Form:FormGroup;
    response;
    matTableLenght: any;
    dv: number | any; //use later
    maxDate: any;
    Math: any;
    Limit: any;
    OffSet: number = 0;
    //pagination
    itemsPerPage = 10; //you could use your specified
    totalItems: number | any;
    pageIndex = 1;

    file: File;
    displayedColumns = [

        "File",
        "Actions",
       ]

    constructor(
        private layoutUtilsService: LayoutUtilsService,private fb: FormBuilder,
        private cdRef: ChangeDetectorRef,private apkUploadService:ApkUploadService,private spinner: NgxSpinnerService
    ) {
    }
    ngAfterViewInit() {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 400 + 'px';
            this.GetGeneralDocuments(true);
    }

    ngOnInit(): void {
this.createForm();
    }

    createForm() {
        this.Form = this.fb.group({
            file: [''],
        });
    }

    onFileChange(event) {
        this.file = null;
        if (event.target.files && event.target.files[0]) {
            var filesAmount = event.target.files.length;
            this.file = event.target.files[0];

            var Name = this.file.name.split('.').pop();
            if (Name != undefined) {
                if (Name.toLowerCase() == "apk" || Name.toLowerCase() == "png" || Name.toLowerCase() == "mp4"|| Name.toLowerCase() == "mov"|| Name.toLowerCase() == "mkv") {
                    var reader = new FileReader();

                    reader.onload = (event: any) => {
                        this.rawData.file = this.file;
                        this.imageUrl = event.target.result;
                        this.visible = false;
                    }
                    reader.readAsDataURL(this.file);

                } else {
                    var Message = 'selected file Only MP4, MOV ,MKV, AVI, MPEG-2 or APK';
                    this.layoutUtilsService.alertElement(
                            '',
                            Message,
                            null
                        );

                    this.Form.get('file').reset();
                    return;
                }
            }
        } else {
            this.visible = true;
        }

    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.OffSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.GetGeneralDocuments();
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }

    paginateAs(pageIndex: any, pageSize: any = this.itemsPerPage) {

    }

    Upload() {
debugger
        if (!this.file) {
            var Message;
            var Code;
            this.layoutUtilsService.alertElement("", Message = "Please Attach File", Code = null);
            return
        }

        var Message;
        this.spinner.show();
        this.apkUploadService.FileUpload(this.file).pipe(finalize(() => {
            this.spinner.hide();
        })).subscribe((baseResponse)  => {
            debugger
            if (baseResponse.Success) {

                this.layoutUtilsService.alertElementSuccess(
                    "",
                    Message = "File Uploaded Successfully",
                    baseResponse.Code = null
                );
            } else {
                this.layoutUtilsService.alertElement(
                    "",
                    baseResponse.Message,
                    baseResponse.Code = null
                );

            }
        })
    }
    GetGeneralDocuments(is_first = false){
        if (is_first) {
            this.OffSet = 0;
        }


        this.spinner.show()
        var count = this.itemsPerPage.toString();
        var currentIndex = this.OffSet.toString();

        this.apkUploadService.GetGeneralDocuments(count, currentIndex)
            .pipe(
                finalize(() => {
                    this.loading = false;
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {

                if (baseResponse.Success) {
                    debugger
                    this.dataSource.data = baseResponse.DocumentDetail.GeneralDocuments;
                    this.matTableLenght = true;
                    this.dv = this.dataSource.data;
                    this.totalItems = baseResponse?.DocumentDetail?.GeneralDocuments[0].TotalRecords;
                    this.dataSource.data = this.dv.slice(0, this.totalItems)
                    this.OffSet = this.pageIndex;
                    this.dataSource = this.dv.slice(0, this.itemsPerPage);
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    this.matTableLenght = true;
                    this.dataSource = this.dv?.slice(1, 0);//this.dv.slice(2 * this.itemsPerPage - this.itemsPerPage, 2 * this.itemsPerPage);

                    this.OffSet = 0;
                    this.totalItems = 0;
                    this.pageIndex = 1;
                    this.dv = this.dataSource;

                }
            });
    }

    downloadFile(url) {
        window.open(url)
    }

}

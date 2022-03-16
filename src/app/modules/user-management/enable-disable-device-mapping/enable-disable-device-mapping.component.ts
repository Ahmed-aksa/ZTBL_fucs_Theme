import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {finalize} from "rxjs/operators";
import {NgxSpinnerService} from "ngx-spinner";
import {DeviceService} from "../../../shared/services/device.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {ToastrService} from "ngx-toastr";

@Component({
    selector: 'app-enable-disable-device-mapping',
    templateUrl: './enable-disable-device-mapping.component.html',
    styleUrls: ['./enable-disable-device-mapping.component.scss']
})
export class EnableDisableDeviceMappingComponent implements OnInit {
    dataSource = new MatTableDataSource();
    enable_disable_device_mapping: FormGroup;
    zone: any;
    branch: any;
    circle: any;


    matTableLenght: any;
    dv: number | any; //use later

    total_requests_length: number | any;
    displayedColumns = [
        "DeviceId",
        'Status',
        'Description',
        'Actions',
    ];
    itemsPerPage = 5;
    OffSet: number = 0;
    pageIndex: any = 0;
    totalItems: number | any;

    loading: boolean = false;

    constructor(private fb: FormBuilder, private spinner: NgxSpinnerService, private DeviceService: DeviceService, private layoutUtilsService: LayoutUtilsService, private toaster: ToastrService) {
    }

    ngOnInit(): void {
        this.createForm();
    }


    createForm() {
        this.enable_disable_device_mapping = this.fb.group({
            PPNO: [null, Validators.required],
            DeviceID: [null, Validators.required]
        });
    }

    getRequests() {

    }

    searchDevice(is_first = false) {

        if (is_first) {
            this.OffSet = 0;
        }
        // if (this.enable_disable_device_mapping.invalid) {
        //     const controls = this.enable_disable_device_mapping.controls;
        //     Object.keys(controls).forEach(controlName =>
        //         controls[controlName].markAsTouched()
        //     );
        //     this.toaster.error("Please Enter All Required fields");
        //     return;
        // }
        this.spinner.show()
        if (this.enable_disable_device_mapping.controls.PPNO.value != "") {
            this.OffSet = 0;
        }
        var count = this.itemsPerPage.toString();
        var currentIndex = this.OffSet.toString();

        this.DeviceService.GetDeviceMappings(this.enable_disable_device_mapping.controls.PPNO.value, this.enable_disable_device_mapping.controls.DeviceID.value, count, currentIndex)
            .pipe(
                finalize(() => {
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                debugger
                if (baseResponse.Success) {
                    this.dataSource.data = baseResponse.MappingRequests;
                    this.matTableLenght = true;
                    this.dv = this.dataSource.data;
                    this.totalItems = baseResponse.MappingRequests[0].TotalRecords;
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

    CheckStatusActivate(value) {
        if (value.IsActive == 0) {
            return true;
        } else {
            return false;
        }
    }

    CheckStatusDeactivate(value) {
        if (value.IsActive == 1) {
            return true;
        } else {
            return false;
        }
    }

    checkStatus(value) {
        if (value == 0) {
            return 'Disabled';
        } else {
            return 'Active';
        }
    }

    ChangeStatus(value) {
        this.spinner.show()
        this.DeviceService.statusChange(value)
            .pipe(
                finalize(() => {
                    this.spinner.hide()
                })
            )
            .subscribe(baseResponse => {
                debugger
                if (baseResponse.Success) {
                    this.searchDevice();
                    this.layoutUtilsService.alertElementSuccess("", baseResponse.Message);
                } else {
                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                }
            });
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }

    MathCeil(value: any) {
        return Math.ceil(value);
    }

    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.OffSet = (pageIndex - 1) * this.itemsPerPage;
        this.pageIndex = pageIndex;
        this.searchDevice()
        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage);
    }


}

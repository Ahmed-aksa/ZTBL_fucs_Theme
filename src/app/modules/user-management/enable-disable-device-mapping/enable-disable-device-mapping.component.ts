import {Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {FormBuilder, FormGroup} from "@angular/forms";

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

    total_requests_length: number | any;
    displayedColumns = [
        'PPNO',
        'Details',
        'Action',
    ];
    itemsPerPage = 5;
    OffSet: number = 0;
    pageIndex: any = 0;


    loading: boolean = false;

    constructor(private fb: FormBuilder) {
    }

    ngOnInit(): void {
        this.createForm();
    }


    createForm() {
        this.enable_disable_device_mapping = this.fb.group({
            "PPNO": []
        });
    }

    getRequests() {

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
        if (Number.isNaN(pageIndex)) {
            this.pageIndex = this.pageIndex + 1;
        } else {
            this.pageIndex = pageIndex;
        }
        this.itemsPerPage = pageSize;
        this.OffSet = (this.pageIndex - 1) * this.itemsPerPage;
        if (this.OffSet < 0) {
            this.OffSet = 0;
        }
        this.getRequests();
    }
}

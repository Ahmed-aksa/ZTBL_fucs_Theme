import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {MatDialog} from '@angular/material/dialog';
import {MatPaginator} from '@angular/material/paginator';
import {MatSnackBar} from '@angular/material/snack-bar';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSource} from '@angular/material/table';
import {Activity} from 'app/shared/models/activity.model';
import {Circle} from 'app/shared/models/circle.model';
import {LayoutUtilsService} from 'app/shared/services/layout_utils.service';


import {finalize} from 'rxjs/operators';
import {GeofencingEditComponent} from '../geofencing-edit/geofencing-edit.component';
import {DataService} from '../../../../shared/services/data-service.model'
import {CircleService} from 'app/shared/services/circle.service';
import {UserUtilsService} from 'app/shared/services/users_utils.service';
import {NgxSpinnerService} from 'ngx-spinner';
import {FormBuilder, FormGroup} from "@angular/forms";
import {ToastrService} from "ngx-toastr";


@Component({
    selector: 'kt-circle-list',
    templateUrl: './circle-list.component.html',
    providers: [DataService]
})
export class CircleListComponent implements OnInit {

    dataSource = new MatTableDataSource();
    @ViewChild('searchInput', {static: true}) searchInput: ElementRef;
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;
    loading: boolean;
    loadingdata: boolean;
    BMUser: boolean;
    displayedColumns = ['circleId', 'circleCode', 'actions'];


    gridHeight: string;
    branchCode: string;
    fieldsHide: boolean;
    _currentActivity: Activity = new Activity();

    create_circ_form: FormGroup;
    branch: any;
    zone: any;
    circle: any;

    constructor(
        public dialog: MatDialog,
        public snackBar: MatSnackBar,
        private layoutUtilsService: LayoutUtilsService,
        private user_utils_service: UserUtilsService,
        private _circleService: CircleService,
        private _cdf: ChangeDetectorRef,
        private formBuilder: FormBuilder,
        private spinner: NgxSpinnerService,
        private toastr: ToastrService
    ) {
    }

    ngOnInit() {
        this.create_circ_form = this.formBuilder.group({});
        this.BMUser = false;
        this.fieldsHide = false;
        this._currentActivity = this.user_utils_service.getActivity('Create Fence');
    }

    ngAfterViewInit() {

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.gridHeight = window.innerHeight - 400 + 'px';
    }

    find() {
        if (this.create_circ_form.invalid) {
            this.toastr.error("Please enter valid details first");
            return;
        }
        this.loadingdata = true;
        this.dataSource.data = [];
        this._circleService.getCircles(this.branch)
            .pipe(
                finalize(() => {
                    this.loadingdata = false;
                    this.spinner.hide()
                })
            ).subscribe(baseResponse => {
            if (baseResponse.Success)
                this.dataSource.data = baseResponse.Circles;
            else
                this.layoutUtilsService.alertElement("", baseResponse.Message, baseResponse.Code);

        });
    }

    applyFilter(filterValue: string
    ) {
        filterValue = filterValue.trim();
        filterValue = filterValue.toLowerCase();
        this.dataSource.filter = filterValue;
    }

    exportToExcel() {
        //this.exportActivities = [];
        //Object.assign(this.tempExportActivities, this.dataSource.data);
        //this.tempExportActivities.forEach((o, i) => {
        //  this.exportActivities.push({
        //    activityName: o.activityName,
        //    activityURL: o.activityURL,
        //    parentActivityName: o.parentActivityName
        //  });
        //});
        //this.excelService.exportAsExcelFile(this.exportActivities, 'activities');
    }

    filterConfiguration()
        :
        any {
        const filter: any = {};
        const searchText: string = this.searchInput.nativeElement.value;
        filter.title = searchText;
        return filter;
    }


    ngOnDestroy() {
        //this.DataService.Branch = this.Branch;
        //this.DataService.Zone = this.Zone;
    }


    editGeofencing(circle: Circle) {


        let dialogRef = this.dialog.open(GeofencingEditComponent, {
            data: {
                circle: circle,
                zone: this.zone,
                branch: this.branch
            }, disableClose: true, panelClass: ['h-screen', 'max-w-full', 'max-h-full', 'w-full', 'h-full']
        });
        dialogRef.afterClosed().subscribe(res => {
            dialogRef = null;
            this.find();
        });
    }

    getAllData(event) {
        this.zone = event.final_zone;
        this.branch = event.final_branch;
        this.circle = event.final_circle;
    }
}

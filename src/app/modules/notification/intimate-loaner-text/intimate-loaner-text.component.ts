import {AfterViewInit, Component, OnInit} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {Lov} from "../../../shared/classes/lov.class";
import {NotificationService} from "../service/notification.service";
import {NgxSpinnerService} from "ngx-spinner";
import {LovService} from "../../../shared/services/lov.service";
import {LayoutUtilsService} from "../../../shared/services/layout_utils.service";
import {finalize} from "rxjs/operators";

@Component({
  selector: 'app-intimate-loaner-text',
  templateUrl: './intimate-loaner-text.component.html',
  styleUrls: ['./intimate-loaner-text.component.scss']
})
export class IntimateLoanerTextComponent implements OnInit, AfterViewInit {
    displayedColumns = ['GL','Cnic', 'Name', 'FatherName', 'Lcno', 'Los', 'Ndd','Address', 'Sl', 'Tsa', 'Tda'];
    loaded = true;
    matTableLenght = false;
    loading = false;

    itemsPerPage = 10;
    pageIndex = 1;
    totalItems: number | any;
    dv: number | any; //use later
    gridHeight: string;

    dataSource: MatTableDataSource<any>;

    LoggedInUserInfo: BaseResponseModel;

    statusLov: any;
    public LovCall = new Lov();


    constructor(
        private _notification: NotificationService,
        private spinner: NgxSpinnerService,
        private _lovService: LovService,
        private layoutUtilsService: LayoutUtilsService,
    ) {
    }

    ngOnInit(): void {
        this.find()
    }


    find() {
        let t = 4;
        this.spinner.show();
        this._notification.notificationCards(t)
            .pipe(
                finalize(() => {
                    this.spinner.hide();
                })
            )
            .subscribe((baseResponse: BaseResponseModel) => {
                if (baseResponse.Success === true) {
                    this.dataSource = baseResponse.Loan.SamNpLList
                    this.dv = this.dataSource;
                    this.matTableLenght = true

                } else {

                    this.layoutUtilsService.alertElement("", baseResponse.Message);
                    this.matTableLenght = false;
                    this.dataSource = null;
                    //this.offSet = 0;
                    this.pageIndex = 1;

                }
            })
    }


    paginate(pageIndex: any, pageSize: any = this.itemsPerPage) {
        this.itemsPerPage = pageSize;
        this.pageIndex = pageIndex;
        //this.OffSet = pageIndex;

        this.dataSource = this.dv.slice(pageIndex * this.itemsPerPage - this.itemsPerPage, pageIndex * this.itemsPerPage); //slice is used to get limited amount of data from APi
    }


    ngAfterViewInit() {

        this.gridHeight = window.innerHeight - 200 + 'px';
    }


}

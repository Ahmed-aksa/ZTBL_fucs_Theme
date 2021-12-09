import {Component, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {MatTableDataSource} from "@angular/material/table";
import {MatPaginator} from "@angular/material/paginator";
import {MatSort} from "@angular/material/sort";
import { SessionExpireService } from 'app/shared/services/session-expire.service';

@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss'],
    encapsulation: ViewEncapsulation.None
})
export class DashboardComponent implements OnInit {
    popup: any = false;
    time :any
    constructor(private _sessionExpireService: SessionExpireService) {
    }

    dataSource = new MatTableDataSource();
    displayedColumns = ['EmployeeNo', 'EmployeeName', 'PhoneNumber', 'Email', 'ZoneName', 'BranchName', 'UserCircles', 'actions'];
    @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    ngOnInit(): void {
        this._sessionExpireService.count.subscribe(c => {
            if(c<30){
              this.popup=true;
            }
            this.time = c.toString();
          });
    }

}

import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BaseRequestModel} from '../models/base_request.model';
import {BaseResponseModel} from '../models/base_response.model';
import {HttpUtilsService} from './http_utils.service';
import {UserUtilsService} from './users_utils.service';
import {ChartOptions} from "../../modules/dashboard/evp-credit-dashboard/evp-credit-dashboard.component";

@Injectable({providedIn: 'root'})
export class DashboardService {
    public request = new BaseRequestModel();

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService,
        private userUtilsService: UserUtilsService
    ) {
    }

    getDashboardData(profile_id): Observable<any> {
        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.request.User = userInfo.User;
        this.request.Profile={
            ProfileId:profile_id
        }
        return this.http
            .post(
                `${environment.apiUrl}/Dashboard/GetDashboardReport`,
                this.request,
                {headers: this.httpUtils.getHTTPHeaders()}
            )
            .pipe(map((res: any) => res));
    }

    assignKeys(data: any, title): Partial<ChartOptions> {
        var obj = [];
        (Object.values(data)).forEach(x => {
            obj.push(Number(x));

        })
        return {
            series: obj,
            chart: {
                width: "100%",
                type: "pie"
            },
            labels: Object.keys(data),
            theme: {
                monochrome: {
                    enabled: false
                }
            },
            title: {
                text: title
            },
            responsive: [
                {
                    breakpoint: 480,
                    options: {
                        chart: {
                            width: 200
                        },
                        legend: {
                            position: "bottom"
                        }
                    }
                }
            ]
        };
    }

}

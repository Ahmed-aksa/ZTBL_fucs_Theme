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

    getDashboardData(profile_id, year = '2021'): Observable<any> {
        this.request = new BaseRequestModel();
        var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
        this.request.User = userInfo.User;
        this.request.Profile = {
            ProfileId: profile_id
        };
        this.request.ReportFilters = {
            Year: year
        };
        if (profile_id == 56) {
            var userInfo = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
            var circleIds = [];
            if (userInfo.UserCircleMappings && userInfo.UserCircleMappings.length != 0) {
                userInfo.UserCircleMappings.forEach(element => {
                    circleIds.push(element.CircleId);
                });
            } else {
                circleIds = ["0"]
            }
            var _circles = circleIds.toString();
            let circle = {
                CircleIds: _circles
            }
            this.request.Circle = circle;
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
        if (data) {
            var obj = [];
            if (data)
                (Object.values(data))?.forEach(x => {
                    if (Number(x) != 0)
                        obj.push(Number(x));

                });

            return {
                series: obj,
                chart: {
                    width: "100%",
                    type: "pie"
                },
                labels: Object.keys(data).map(key => key = key.replace(/([a-z0-9])([A-Z])/g, '$1 $2')),
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
                ],
                noData: {
                    text: "No Data",
                    align: 'center',
                    verticalAlign: 'middle',
                    offsetX: 0,
                    offsetY: 0,
                    style: {
                        color: undefined,
                        fontSize: '14px',
                        fontFamily: undefined
                    }
                }
            };
        }
    }

    getYears() {
        return this.http.post(
            `${environment.apiUrl}/Dashboard/GetYearsForDashboard`,
            this.request,
            {headers: this.httpUtils.getHTTPHeaders()}
        )
            .pipe(map((res: any) => res));
    }
}

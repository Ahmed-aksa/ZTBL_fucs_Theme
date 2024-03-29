import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {environment} from 'environments/environment';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BaseRequestModel} from '../models/base_request.model';
import {HttpUtilsService} from './http_utils.service';
import {UserUtilsService} from './users_utils.service';
import {ChartOptions} from "../../modules/dashboard/dashboard.component";

@Injectable({providedIn: 'root'})
export class DashboardService {
    public request = new BaseRequestModel();

    constructor(
        private http: HttpClient,
        private httpUtils: HttpUtilsService,
        private userUtilsService: UserUtilsService
    ) {
    }

    getDashboardData(profile_id, year): Observable<any> {
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
            let colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#D7263D', '#F9C80E', '#5A2A27', '#C7F464'];
            var obj = [];
            var labels = [];
            if (data)
                (Object.keys(data))?.forEach(x => {
                    if (this.getCamelCase(x) == 'Audit Paras')
                        labels.push(this.getCamelCase(x) + ' (Not Digitalized)');
                    else
                        labels.push(this.getCamelCase(x));
                    obj.push(data[x]);
                    //}

                });

            var series = [];
            var sliceSize = 100 / obj.length
            for (let i = 0; i < obj?.length; i++) {
                series.push(sliceSize)
            }
            return {
                series: obj.length > 1 ? series : [],
                colors: colors,
                chart: {
                    width: "100%",
                    type: "pie"
                },
                labels: labels.length > 1 ? labels : [],
                theme: {
                    monochrome: {
                        enabled: false
                    }
                },
                title: {
                    text: title
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val, object) {
                        let data = obj[object.seriesIndex];
                        if (isNaN(data) && data.includes(",")) {
                            return data.split(",")
                        } else {
                            return obj[object.seriesIndex];
                        }
                    }
                },
                tooltip: {
                    custom: function ({series, seriesIndex, dataPointIndex, w}) {

                        let value
                        if(w.config.labels[seriesIndex].includes("(")){
                            let d = w.config.labels[seriesIndex].split("(")[0].toString().trim()
                            value = data[d.replaceAll(" ", "")]
                        }else{
                            value = data[w.config.labels[seriesIndex].replaceAll(" ", "")]
                        }
                        return "<div class='px-3 py-2' style='background-color:" + colors[seriesIndex] + "'>" + w.config.labels[seriesIndex] + " : " + value + "</div>";
                    }
                },
                responsive: [
                    {
                        breakpoint: undefined,
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
                    text: "No Data Available",
                    align: 'center',
                    verticalAlign: 'middle',
                    offsetX: 0,
                    offsetY: -50,
                    style: {

                        color: '#01671B',
                        fontSize: '18px',

                    }
                }
            };
        }
    }

    assignKeysForMCO(data: any, title): Partial<ChartOptions> {

        if (data) {
            let colors = ['#008FFB', '#00E396', '#FEB019', '#FF4560', '#775DD0', '#546E7A', '#D7263D', '#F9C80E', '#5A2A27', '#C7F464'];
            var obj = [];
            var labels = [];
            if (data)
                (Object.keys(data))?.forEach(x => {
                    //if (Number(data[x]) != 0) {
                    let key = this.getCamelCase(x);
                    if (key.includes("Deposit")) {
                        key += " (For Complete Branch)"
                        labels.push(key);
                    } else {
                        labels.push(key);
                    }
                    obj.push(data[x]);
                    //}

                });

            var series = [];
            var sliceSize = 100 / obj.length
            for (let i = 0; i < obj?.length; i++) {
                series.push(sliceSize)
            }
            return {
                series: obj.length > 1 ? series : [],
                colors: colors,
                chart: {
                    width: "100%",
                    type: "pie"
                },
                labels: labels.length > 1 ? labels : [],
                theme: {
                    monochrome: {
                        enabled: false
                    }
                },
                title: {
                    text: title
                },
                dataLabels: {
                    enabled: true,
                    formatter: function (val, object) {
                        let data = obj[object.seriesIndex];
                        if (isNaN(data) && data.includes(",")) {
                            return data.split(",")
                        } else {
                            return obj[object.seriesIndex];
                        }
                    }
                },
                tooltip: {
                    custom: function ({series, seriesIndex, dataPointIndex, w}) {

                        let key = w.config.labels[seriesIndex].replaceAll(" ", "")
                        if (key.includes("(For")) {
                            key = key.split("(")[0];
                        }
                        let value = data[key];
                        return "<div class='px-3 py-2' style='background-color:" + colors[seriesIndex] + "'>" + w.config.labels[seriesIndex] + " : " + value + "</div>";
                    }
                },
                responsive: [
                    {
                        breakpoint: undefined,
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
                    text: "No Data Available",
                    align: 'center',
                    verticalAlign: 'middle',
                    offsetX: 0,
                    offsetY: -50,
                    style: {

                        color: '#01671B',
                        fontSize: '18px',

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

    getCamelCaseString(data, check) {
        if (!data) {
            return
        }
        const myArray = data.split(":");
        if (check == 0) {
            return myArray[0].replace(/([a-z0-9])([A-Z])/g, '$1 $2')
        } else {
            return myArray[1];
        }
    }

    getCamelCase(data,) {
        if (!data) {
            return
        }

        return data.replace(/([a-z0-9])([A-Z])/g, '$1 $2')

    }

    getSortDate(data: any) {
        var date = Object.getOwnPropertyNames(data);
        var sortArray = date.sort();

        var perChunk = 3 // items per chunk
        var result = sortArray.reduce((resultArray, item, index) => {
            const chunkIndex = Math.floor(index / perChunk)
            if (!resultArray[chunkIndex]) {
                resultArray[chunkIndex] = [] // start a new chunk
            }
            resultArray[chunkIndex].push(item)
            return resultArray
        }, [])


        if (result.length > 3) {
            // inorder to fix the table view as per given view in FSD.
            [result[1], result[3]] = [result[3], result[1]];
            [result[2], result[3]] = [result[3], result[2]];
        }
        result.forEach(x => {
            var a, b, c;
            for (let i = 0; i < 3; i++) {

                if (x[i].includes("Target")) {
                    a = x[i];
                } else if (x[i].includes("Achievement")) {
                    b = x[i];
                } else {
                    c = x[i];
                }
            }

            x[0] = a != undefined ? a + ":" + data[a] : '-';
            x[1] = b != undefined ? b + ":" + data[b] : '-';
            x[2] = c != undefined ? c + "(%):" + data[c] : '-';

        });
        return result;
    }

}


// Angular
import {Injectable} from '@angular/core';
import {HttpParams, HttpHeaders} from '@angular/common/http';
// CRUD
// import {QueryResultsModel} from '../models/query-models/query-results.model';
import {QueryResultsModel} from "../models/query-result.model";
import {QueryParamsModel} from "../models/query_params.model";
import {UserInfoModel} from "../models/user_info.model";
import {HttpExtenstionsModel} from "../models/http_extension.model";

@Injectable()
export class HttpUtilsService {
    /**
     * Prepare query http params
     * @param queryParams: QueryParamsModel
     */
    getFindHTTPParams(queryParams): HttpParams {
        const params = new HttpParams()
            .set('lastNamefilter', queryParams.filter)
            .set('sortOrder', queryParams.sortOrder)
            .set('sortField', queryParams.sortField)
            .set('pageNumber', queryParams.pageNumber.toString())
            .set('pageSize', queryParams.pageSize.toString());

        return params;
    }

    /**
     * get standard content-type
     */
    getHTTPHeaders(): HttpHeaders {

        const result = new HttpHeaders();
        result.set('Access-Control-Allow-Origin', '*');
        result.set('Content-Type', 'application/json');
        return result;
    }

    baseFilter(_entities: any[], _queryParams: QueryParamsModel, _filtrationFields: string[] = []): QueryResultsModel {
        const httpExtention = new HttpExtenstionsModel();
        return httpExtention.baseFilter(_entities, _queryParams, _filtrationFields);
    }

    sortArray(_incomingArray: any[], _sortField: string = '', _sortOrder: string = 'asc'): any[] {
        const httpExtention = new HttpExtenstionsModel();
        return httpExtention.sortArray(_incomingArray, _sortField, _sortOrder);
    }

    searchInArray(_incomingArray: any[], _queryObj: any, _filtrationFields: string[] = []): any[] {
        const httpExtention = new HttpExtenstionsModel();
        return httpExtention.searchInArray(_incomingArray, _queryObj, _filtrationFields);
    }

    getUserInfo(): UserInfoModel {
        var user = new UserInfoModel();
        user.userID = 0;
        user.emailAddress = "string";
        user.msisdn = "string";
        user.sessionId = "string";
        user.userName = "z";
        user.userType = "string";
        user.channel = 1
        return user;
    }
}

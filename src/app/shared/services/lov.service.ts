import { Injectable } from '@angular/core';

import { map } from 'rxjs/operators';
import {ChildLov, Lov} from "../classes/lov.class";
import {BaseResponseModel} from "../models/base_response.model";
import {HttpClient} from "@angular/common/http";
import {HttpUtilsService} from "./http_utils.service";
import {environment} from "../../../environments/environment";
@Injectable({
    providedIn: 'root'
})
export class LovService {

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService) { }



    public async CallLovAPI(DataObj: Lov) {

        //this.ObjLovResponse = new Lov();
        var req = JSON.stringify({ LovPagination: { TagName: DataObj.TagName } });
        //console.log('GetLOVsByTag request packet');
        //console.log(req);
        return this.http.post(`${environment.apiUrl}/LOV/GetLOVsByTag`, { LovPagination: { TagName: DataObj.TagName } },
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
            map((res: BaseResponseModel) => res)

        ).toPromise();

    }

    public async CallChildLovAPI(DataObj: ChildLov) {

        //this.ObjLovResponse = new Lov();
        var req = JSON.stringify({ LovPagination: { TagName: DataObj.TagName, ParentId: DataObj.ParentId } });
        console.log('GetLOVsByTag request packet');
        console.log(req);
        return this.http.post(`${environment.apiUrl}/LOV/GetLOVsByTag`, { LovPagination: { TagName: DataObj.TagName, ParentId: DataObj.ParentId } },
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
            map((res: BaseResponseModel) => res)

        ).toPromise();

    }


    public  SortLovs(Data: any) {

        return Data.sort((a, b) => {
            if (a.Name < b.Name) { return -1; }
            if (a.Name > b.Name) { return 1; }
        })

    }

    public IsReadonly(Data: any) {

        if (Data == null || Data == undefined || Data == '')
            return false;

        else
            return true;

    }

    public async GetDocumentTypeLOV() {

        return this.http.post(`${environment.apiUrl}/LOV/GetDocumentTypeLOV`, '',
            { headers: this.httpUtils.getHTTPHeaders() }).pipe(
            map((res: BaseResponseModel) => res)

        ).toPromise();

    }



}

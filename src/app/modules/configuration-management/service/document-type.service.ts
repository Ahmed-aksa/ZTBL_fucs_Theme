import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {BaseRequestModel} from "../../../shared/models/base_request.model";
import {BaseResponseModel} from "../../../shared/models/base_response.model";
import {DocumentTypeModel} from "../models/document_type.model";
import {HttpUtilsService} from "../../../shared/services/http_utils.service";
import {environment} from "../../../../environments/environment";


@Injectable({
    providedIn: 'root'
})
export class DocumentTypeService {

    public request = new BaseRequestModel();

    constructor(private http: HttpClient, private httpUtils: HttpUtilsService) {
    }


    AddDocumentType(documentType: DocumentTypeModel): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.request.DocumentType = documentType;
        return this.http.post(`${environment.apiUrl}/Document/AddDocumentType`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    UpdateDocumentType(documentType: DocumentTypeModel): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.request.DocumentType = documentType;
        return this.http.post(`${environment.apiUrl}/Document/UpdateDocumentType`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


    DeleteDocumentType(documentType: DocumentTypeModel): Observable<BaseResponseModel> {
        this.request = new BaseRequestModel();
        this.request.DocumentType = documentType;

        return this.http.post(`${environment.apiUrl}/Document/DeleteDocumentType`, this.request,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }

    GetDocumentTypes(): Observable<BaseResponseModel> {

        return this.http.post(`${environment.apiUrl}/Document/GetDocumentTypes`,
            {headers: this.httpUtils.getHTTPHeaders()}).pipe(
            map((res: BaseResponseModel) => res)
        );
    }


}

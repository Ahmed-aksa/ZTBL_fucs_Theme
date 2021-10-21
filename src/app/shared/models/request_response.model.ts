export class RequestResponse {
    Request: string;
    Response: string;
    FrontEndRequest: string;
    FrontEndResponse: string;
    APIName: string;

    clear() {
        this.Request = '';
        this.Response = '';
    }
}

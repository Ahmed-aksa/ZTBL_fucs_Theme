export class RequestResponse {
    Request: string;
    Response: string;
    FrontEndRequest: string;
    FrontEndResponse: string;
    APIName: string;
    EncRequest: string;

    clear() {
        this.Request = '';
        this.Response = '';
    }
}

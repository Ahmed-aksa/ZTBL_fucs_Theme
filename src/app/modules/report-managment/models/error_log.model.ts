export class ErrorLogDetails {
    Id: number;
    TransactionId: number;
    Code: string;
    DateTime: string;
    ErrorTrace: string;
    InputParameters: string;
    ZtblInputParams: string;
    MethodName: string;
    Message: string;
    ChannelId: number;
    LoginName: string;
    ServerIP: string;

    clear() {

        this.Id = 0;
        this.TransactionId = 0;
        this.Code = '';
        this.DateTime = '';
        this.ErrorTrace = '';
        this.InputParameters = '';
        this.MethodName = '';
        this.Message = '';
        this.ChannelId = 0;
        this.LoginName = '';
        this.ServerIP = '';
    }

}

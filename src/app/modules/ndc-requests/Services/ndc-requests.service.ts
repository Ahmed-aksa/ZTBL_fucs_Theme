import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
    providedIn: 'root'
})
export class NdcRequestsService {

    request_response = {
        'Branch': {
            'BranchId': '102',
            'BranchCode': '20238',
            'Id': 0,
            'Name': 'NOORPUR TOWN',
            'WorkingDate': '11012021'
        },
        'Circle': {
            'CircleIds': '53444,53443,53442,53441'
        },
        'NDCRequest': {
            'Cnic': '',
            'Limit': '0',
            'Offset': '0',
            "ID": "673336"
        },
        'DeviceLocation': {
            'BtsId': '0',
            'BtsLoc': '',
            'Lat': '33.65898',
            'Long': '73.057665',
            'Src': 'GPS'
        },
        'doPerformOTP': false,
        'TranId': 2830,
        'User': {
            'IsActive': 0,
            'App': 2,
            'Channel': 'user',
            'ChannelID': 0,
            'DisplayName': 'MUHAMMAD ALI',
            'Lat': 0.0,
            'Long': 0.0,
            'ProfileID': 0,
            'UserId': 'B-4070',
            'UserIp': '192.168.0.137',
            'UserName': '131694',
            'UserType': 0
        },
        'Zone': {
            'Id': 0,
            'ZoneId': '50055',
            'ZoneName': 'SAHIWAL'
        }
    };

    constructor(private http: HttpClient) {
    }


    getRequests(cnic = '', offset = '0', limit = '10') {
        this.request_response.NDCRequest.Cnic = cnic;
        this.request_response.NDCRequest.Offset = offset;
        this.request_response.NDCRequest.Limit = limit;
        return this.http.post(environment.apiUrl + '/NDC/SearchNDCList', this.request_response);
    }

    downloadFile(cnic: any, id: any) {
        this.request_response.NDCRequest.Cnic = cnic;
        this.request_response.NDCRequest.ID = id;
        return this.http.post(environment.apiUrl + '/NDC/DownloadNDC', this.request_response);
    }

}

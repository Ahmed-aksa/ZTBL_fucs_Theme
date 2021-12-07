export class Circle {
    Id: number;
    Name: string;
    BranchId: number;
    Code: string;
    CenterLatitude: string;
    CenterLongitude: string;
    GeoFancPoints: string;
    FenceIds: number

    clear() {
        this.Name = '';
        this.BranchId = 0;
        this.Code = '';
        this.GeoFancPoints = '';
    }
}

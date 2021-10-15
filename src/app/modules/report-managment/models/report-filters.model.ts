export class ReportFilters {
    Id: number;
    PPNumber: number;
    StartDate: string;
    EndDate: string;
    TranId: number;
    ApiName: string;

    clear() {
        this.Id = 0;
        this.StartDate = null;
        this.EndDate = null;
        this.TranId = null;
        this.ApiName = null;
    }

}

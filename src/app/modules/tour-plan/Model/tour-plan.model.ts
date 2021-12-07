export class TourPlan {
    TourPlanId: string[];
    CircleId: string;
    VisitedDate: string;
    Purpose: string;
    Remarks: string;
    Status: string;


}

export class ChangesTourPlanStatusDto {
    Status: string;
    TourPlanIds: number[];
}


export class Activity {
    PageSequence: string;
    ProfileID: any
    ActivityID: number;
    ActivityName: string;
    ParentActivityName: string;
    ActivityUrl: string;
    ParentActivityID?: number;
    isActivityChecked: boolean;
    IsActive: boolean;
    IsEODVisible: boolean;
    IsVisibleInAPP: boolean;
    IsParent: any;
    Status: boolean;
    IsReadOnly: boolean;
    TagName: string;
    PageIcon: string;
    C: boolean;
    R: boolean;
    U: boolean;
    D: boolean;
    CreatedBy: string;
    UpdatedBy: string;
    EndedBy: string;


    //userInfo: UserInfoModel;

    clear() {
        this.ActivityID = 0;
        this.ActivityName = '';
        this.ActivityUrl = '';
        this.ParentActivityID = 0;
        this.C = false;
        this.R = false;
        this.U = false;
        this.D = false;
        this.IsParent = false;
        this.IsReadOnly = false;
        this.IsEODVisible= false;
        this.IsVisibleInAPP =false;
        this.IsActive = false;
    }
}

export class Profile {
    ProfileID: number;
    ProfileName: string;
    ProfileDesc: string;
    ActivityList: string;
    ChannelID: number;
    CreatedBy: string;
    UpdatedBy: string;
    EndedBy: string;
    Status: boolean;
    isSelected: boolean;
    AccessToData: number;
}

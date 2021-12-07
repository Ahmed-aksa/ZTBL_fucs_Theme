import {UserUtilsService} from "../../../shared/services/users_utils.service";

export class WorkingDate {

    loggedInUser;

    constructor(
        private userUtilsService: UserUtilsService
    ) {
        this.loggedInUser = this.userUtilsService.getSearchResultsDataOfZonesBranchCircle();
    }

    date() {
        if (this.loggedInUser.Branch) {
            let dateString = this.loggedInUser.Branch.WorkingDate;
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));
            const branchWorkingDate = new Date(year, month - 1, day);
            return branchWorkingDate;
        } else {
            let dateString = '11012021';
            var day = parseInt(dateString.substring(0, 2));
            var month = parseInt(dateString.substring(2, 4));
            var year = parseInt(dateString.substring(4, 8));

            const branchWorkingDate = new Date(year, month - 1, day);
            return branchWorkingDate;
        }
    }

}

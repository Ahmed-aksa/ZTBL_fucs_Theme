import {Component, OnInit} from '@angular/core';
import {environment} from "../../../environments/environment";

@Component({
    selector: 'app-Targets',
    templateUrl: './Targets.component.html',
    styleUrls: ['./Targets.component.scss'],
})
export class TargetsComponent implements OnInit {

    userGroup: any = [];
    isHiddenTab: boolean = true
    mco_profile_id: any;
    zm_profile_id: any;
    ro_profile_id: any;
    bm_profile_id: any;
    zc_profile_id: any;
    evp_od_profile_id: any;
    evp_cd_profile_id: any;
    recovery_sam_profile_id: any;
    pz_profile_id: any;
    rc_profile_id: any;
    pc_profile_id: any;
    evp_lmd_profile_id: any;
    svp_cod: any;
    svp_recovery: any;

    constructor() {
    }

    ngOnInit(): void {
        this.userGroup = JSON.parse(localStorage.getItem("ZTBLUser"))?.User?.userGroup;
    }

    applyClass() {
        if (this.userGroup?.length == 1) {
            return "dash-tab";
        }
    }

    private assignProfileIds() {
        this.mco_profile_id = environment.MCO_Group_ID;
        this.ro_profile_id = environment.RECOVERY_OFFICER;
        this.bm_profile_id = environment.BM;
        this.evp_od_profile_id = environment.EVP_OD;
        this.zc_profile_id = environment.ZC;
        this.zm_profile_id = environment.ZM;
        this.recovery_sam_profile_id = environment.EVP_RS;
        this.evp_cd_profile_id = environment.EVP_CD;
        this.pz_profile_id = environment.PZ;
        this.rc_profile_id = environment.Regional_CHIEF;
        this.pc_profile_id = environment.PROVINCIAL_CHEIF;
        this.evp_lmd_profile_id = environment.PROVINCIAL_CHEIF;
        this.svp_cod = environment.SVP_COD;
        this.svp_recovery = environment.SVP_RECOVERY;
    }
}

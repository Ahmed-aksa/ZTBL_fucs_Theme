/* eslint-disable @typescript-eslint/semi */
/* eslint-disable eol-last */
/* eslint-disable no-trailing-spaces */
/* eslint-disable @typescript-eslint/quotes */
/* eslint-disable @typescript-eslint/naming-convention */
import {BaseModel} from 'app/shared/models/base-model.model';

export class VillageBenchMark extends BaseModel {
    Id: string;
    VillageName: string;
    NoOfFarmer: number;
    FarmSize: number;
    GenderCount: number;
    GenderType: string;
    AverageLoanSize: number;
    SubsistenceFarmer: number;
    EconomicFarmer: number;
    BigFarmers: number;
    AgriBusinessPotential: string;
    Status: string;
    CreatedBy: string;
    MaleCount: string;
    FemaleCount: string;
    TransGenderCount: string;
    FarmSizeUnit: string;
    CircleId: string;
}

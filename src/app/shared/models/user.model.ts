import { BaseModel } from "./base-model.model";
import { Userpassworddetails } from "./userpassworddetails.model";


export class User extends BaseModel {
  Id: number;
  UserId: string;
  ProfileId: number;
  UserName: number;
  DisplayName: string;
  PhoneNumber: string;
  UpdatedBy: string;
  Remarks: string;
  Email: string;
  AllowBioMatric: boolean;
  App: number;
  isActive: number;
  UserPasswordDetails: Userpassworddetails;

  clear(): void {
    this.UserId = undefined;
    this.UpdatedBy = '';
    this.UserPasswordDetails = new Userpassworddetails();
    this.UserPasswordDetails.clear();
  }
}


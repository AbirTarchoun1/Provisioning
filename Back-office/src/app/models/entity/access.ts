import { License } from "./license";
import { Module } from "./module";

export interface Access {
    AccessId: number;
    AccessName: string;
    CreatedDate: Date;
    LastModificatedDate: Date;
    CreatedBy: string;
    productId : number ;
    Licenses: License[];
    Modules: Module[];
    NumberOfLicenses : number; // to track the number of licenses for the access
  }
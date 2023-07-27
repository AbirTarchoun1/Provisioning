export class LicensesDTO{
    licenseId !: number;
    licenseKey !: number;
    activationMonths!:number;
    lastModificatedDate!: Date;
    createdDate !: Date;
    licenseStatus!: boolean;
    renewMode !: string;
    moduleName  !: [] ;
    accessName!: string;
    productName!: number ;
   username !: string
}
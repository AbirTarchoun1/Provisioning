

export class UpdateModuleRequest{
    moduleId !: number;
    moduleName !: string;
    description !:string;
    modulePackage !: string;
    moduleStatus!: boolean;
    createdDate!:Date ;
    lastModificatedDate!:Date;
   
}

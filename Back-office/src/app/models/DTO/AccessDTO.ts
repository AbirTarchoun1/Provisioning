export class AccessDTO{
    accessId!:number;
    accessName!: string;
    createdDate !: Date;
    lastModificatedDate!: Date;
    moduleName  !: string[];
    productName  !: string;
    //createdBy  !: string;

    moduleIds!: number[]; // <--- specify the type as an array of numbers
}
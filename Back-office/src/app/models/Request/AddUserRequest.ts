export interface AddUserRequest{
userId:number ;
email :String;
username  :String;
userStatus:string;
level :String ;
createdDate ?:   Date;
lastModificatedDate?: Date; 
phoneNumber : string;
    
}
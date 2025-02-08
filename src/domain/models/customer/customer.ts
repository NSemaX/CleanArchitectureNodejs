import { IEntity } from "../entity";

export interface ICustomer extends IEntity {
    Name: string;
    Surname: string;
    Email: string;
    Password: string;
    Status: number;
}



